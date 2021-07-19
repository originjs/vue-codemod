#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import Module from 'module'

import * as yargs from 'yargs'
import * as globby from 'globby'

import createDebug from 'debug'
import { question } from 'readline-sync'

import builtInTransformations from '../transformations'
import { excludedTransformations } from '../transformations'
import vueTransformations from '../vue-transformations'
import { excludedVueTransformations } from '../vue-transformations'
import runTransformation from '../src/runTransformation'
import { transform as packageTransform } from '../src/packageTransformation'

import type { TransformationModule } from '../src/runTransformation'
import { formatterOutput } from '../src/report'
import { ruleDescripition } from '../src/ruleDescription'

const debug = createDebug('vue-codemod:cli')
let processFilePath: string[] = []

const {
  _: files,
  transformation: transformationName,
  runAllTransformation: runAllTransformation,
  reportFormatter: formatter,
  params
} = yargs
  .usage('Usage: vue-codemod [file pattern] <option>')
  .option('transformation', {
    alias: 't',
    type: 'string',
    conflicts: 'runAllTransformation',
    describe: 'Name or path of the transformation module'
  })
  .option('params', {
    alias: 'p',
    describe: 'Custom params to the transformation'
  })
  .option('runAllTransformation', {
    alias: 'a',
    type: 'boolean',
    conflicts: 'transformation',
    describe: 'run all transformation module'
  })
  .option('reportFormatter', {
    alias: 'f',
    type: 'string',
    describe: 'Specify an output report formatter',
    default: 'table',
    choices: ['table', 'detail', 'log']
  })
  .example([
    [
      'npx vue-codemod ./src -a',
      'Run all rules to convert all relevant files in the ./src folder'
    ],
    [
      'npx vue-codemod ./src/components/HelloWorld.vue -t slot-attribute',
      'Run slot-attribute rule to convert HelloWorld.vue'
    ]
  ])
  .help()
  .alias('h', 'help')
  .alias('v', 'version').argv

let logger: Console = console
if (formatter === 'log') {
  let options = {
    flags: 'w', //
    encoding: 'utf8' // utf8编码
  }

  let stdout = fs.createWriteStream('./vue_codemod.log', options)

  logger = new console.Console(stdout)
}

// TODO: port the `Runner` interface of jscodeshift
async function main() {
  if (
    (transformationName == undefined || transformationName == '') &&
    runAllTransformation == undefined
  ) {
    console.log(
      'You need at least one option in command, enter vue-codemod -h to see help. '
    )
    return
  }

  // Remind user to back up files
  const answer = question(
    'Warning!!\n' +
      'This tool may overwrite files.\n' +
      'press enter or enter yes or enter Y to continue:'
  )
  if (!['', 'yes', 'Y'].includes(answer.trim())) {
    console.log('Abort!!!')
    return
  }

  // init global params
  global.globalApi = []
  global.manualList = []
  global.scriptLine = 0
  global.outputReport = {}

  const resolvedPaths = globby.sync(files as string[])
  if (transformationName != undefined) {
    debug(`run ${transformationName} transformation`)
    const transformationModule = loadTransformationModule(transformationName)
    processTransformation(
      resolvedPaths,
      transformationName,
      transformationModule
    )
    if (packageTransform()) {
      processFilePath.push('package.json')
      global.outputReport['package transformation'] = 1
    }
  }

  if (runAllTransformation) {
    debug(`run all transformation`)
    for (let key in builtInTransformations) {
      if (!excludedTransformations.includes(key)) {
        processTransformation(resolvedPaths, key, builtInTransformations[key])
      } else {
        debug(
          `skip ${key} transformation, Because it will run in other transformation`
        )
      }
    }

    for (let key in vueTransformations) {
      if (!excludedVueTransformations.includes(key)) {
        processTransformation(resolvedPaths, key, vueTransformations[key])
      } else {
        debug(
          `skip ${key} transformation, Because it will run in other transformation`
        )
      }
    }
    if (packageTransform()) {
      processFilePath.push('package.json')
      global.outputReport['package transformation'] = 1
    }
  }

  formatterOutput(processFilePath, formatter, logger)
}
/**
 * process files by Transformation
 * @param resolvedPaths resolved file path
 * @param transformationName transformation name
 * @param transformationModule transformation module
 */
function processTransformation(
  resolvedPaths: string[],
  transformationName: string,
  transformationModule: TransformationModule
) {
  console.time(`\x1B[0mProcessing use \x1B[1m${transformationName} transformation\x1B[0m\x1B[33m`)
  if (formatter === 'log')
    logger.time(`Processing use ${transformationName} transformation`)
  let ruleProcessFile: string[] = []
  const extensions = ['.js', '.ts', '.vue', '.jsx', '.tsx']
  for (const p of resolvedPaths) {
    debug(`Processing ${p}…`)
    let retainedSource: string = fs
      .readFileSync(p)
      .toString()
      .split('\r\n')
      .join('\n')
    const fileInfo = {
      path: p,
      source: retainedSource
    }
    const extension = (/\.([^.]*)$/.exec(fileInfo.path) || [])[0]
    if (!extensions.includes(extension)) {
      debug(`skip ${fileInfo.path} file because not end with ${extensions}.`)
      continue
    }
    try {
      debug(`Processing file: ${fileInfo.path}`)
      const result = runTransformation(
        fileInfo,
        transformationModule,
        params as object
      )

      if (retainedSource != result) {
        fs.writeFileSync(p, result)
        ruleProcessFile.push(p)
        if (processFilePath.indexOf(p) == -1) {
          processFilePath.push(p)
        } else {
          debug(`Skip this file ${p} because of duplicate statistics`)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  if (ruleProcessFile.length) {
    console.timeEnd(`\x1B[0mProcessing use \x1B[1m${transformationName} transformation\x1B[0m\x1B[33m`)
    if (formatter === 'log')
      logger.timeEnd(`Processing use ${transformationName} transformation`)
    if (
      ruleDescripition.hasOwnProperty(transformationName) &&
      (formatter === 'detail' || formatter === 'log')
    ) {
      let ruleOutput: { [key: string]: any } = {}
      ruleOutput.rule_name = transformationName
      // @ts-ignore
      ruleOutput.website = ruleDescripition[transformationName].description
      ruleOutput.transformed_files = ruleProcessFile
      console.log('\x1B[0m', ruleOutput)
      if (formatter === 'log') logger.log(ruleOutput)
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
/**
 * load Transformation Module
 * @param nameOrPath
 * @returns
 */
function loadTransformationModule(nameOrPath: string) {
  let jsTransformation = builtInTransformations[nameOrPath]
  let vueTransformation = vueTransformations[nameOrPath]
  if (jsTransformation) {
    return jsTransformation
  }
  if (vueTransformation) {
    return vueTransformation
  }

  const customModulePath = path.resolve(process.cwd(), nameOrPath)
  if (fs.existsSync(customModulePath)) {
    const requireFunc = Module.createRequire(
      path.resolve(process.cwd(), './package.json')
    )
    // TODO: interop with ES module
    // TODO: fix absolute path
    return requireFunc(`./${nameOrPath}`)
  }

  throw new Error(`Cannot find transformation module ${nameOrPath}`)
}
