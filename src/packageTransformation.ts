import * as fs from 'fs'
import * as globby from 'globby'
import * as prettier from 'prettier'
import createDebug from 'debug'

const debug = createDebug('vue-codemod:rule')

type AddOrUpdateConfig = {
  [name: string]: string
}

type Config = {
  [name: string]: AddOrUpdateConfig
}

const globalAddConfig: {
  [name: string]: Config
} = {
  global: {
    add: {},
    update: {
      vue: '^3.1.1',
      vuex: '^4.0.1',
      'vue-router': '^4.0.8',
      'vue-i18n': '^9.1.6'
    },
    delete: { 'vue-template-compiler': '', '@vue/composition-api': '' }
  },
  dependencies: {
    add: {},
    update: {},
    delete: {}
  },
  peerDependencies: { add: {}, update: {}, delete: {} },
  devDependencies: {
    add: {
      '@babel/core': '^7.14.6',
      eslint: '^7.20.0',
      '@vue/compiler-sfc': '^3.1.1',
      'eslint-plugin-vue': '^7.11.1'
    },
    update: {
      '@vue/cli-plugin-babel': '^4.5.0',
      '@vue/cli-plugin-eslint': '^4.5.0',
      '@vue/cli-service': '^4.5.0'
    },
    delete: { 'babel-eslint': '' }
  }
}

/**
 * Creates a fix command that inserts text at the specified index in the source text.
 * @param {int} index The 0-based index at which to insert the new text.
 * @param {string} text The text to insert.
 * @returns {Object} The fix command.
 * @private
 */
export function transform(): boolean {
  debug('Find package.json.')
  const resolvedPaths = globby.sync('package.json' as string)
  if (resolvedPaths.length <= 0) {
    console.warn('package.json is not exists.')
    return false
  }

  let packageObj: any = JSON.parse(fs.readFileSync(resolvedPaths[0]).toString())

  packageObj = process(packageObj)

  let formatted = prettier.format(
    JSON.stringify(packageObj),
    Object.assign(
      { parser: 'json' },
      packageObj?.prettier ? packageObj?.prettier : {}
    )
  )
  fs.writeFileSync(resolvedPaths[0], formatted)
  return true
}
/**
 * Modify the configuration of dependencies
 * @param packageObj package.json source
 */
export function process(packageObj: any): any {
  Object.keys(globalAddConfig)
    .filter(key => {
      return key != 'global'
    })
    .forEach(key => {
      if (packageObj[key] != undefined) {
        debug(`Process ${key}`)
        packageObj[key] = processCore(packageObj[key], globalAddConfig.global)
        packageObj[key] = processCore(packageObj[key], globalAddConfig[key])
      }
    })

  if (packageObj?.eslintConfig?.parserOptions?.parser != undefined) {
    packageObj.eslintConfig.parserOptions.parser = '@babel/eslint-parser'
  }
  return packageObj
}
/**
 * process package.json
 * @param packageObj dependencies...
 * @param config key of config
 * @returns package.json
 */
function processCore(packageObj: any, config: Config): any {
  Object.keys(config.add).forEach(key => {
    packageObj[key] = config.add[key]
  })

  Object.keys(config.update).forEach(key => {
    if (packageObj[key] != undefined) {
      packageObj[key] = config.update[key]
    }
  })

  Object.keys(config.delete).forEach(key => {
    delete packageObj[key]
  })
  return packageObj
}
