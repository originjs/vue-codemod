jest.autoMockOff()

import * as fs from 'fs'
import * as path from 'path'
import runTransformation from './runTransformation'
import transformationMap from '../transformations'
import vueTransformationMap from '../vue-transformations'
import bothTransformationMap from '../both-transformations'

export const runTest = (
  description: string,
  transformationName: string,
  fixtureName: string,
  extension: string = 'vue',
  transformationType: string = 'vue'
) => {
  test(description, () => {
    let p = '../wrapAstTransformation'
    if (transformationType == 'vue') {
      p = '../vue-transformations'
    }
    if (transformationType == 'both') {
      p = '../both-transformations'
    }
    const fixtureDir = path.resolve(
      __dirname,
      p,
      './__testfixtures__',
      transformationName
    )

    const inputPath = path.resolve(
      fixtureDir,
      `${fixtureName}.input.${extension}`
    )
    const outputPath = path.resolve(
      fixtureDir,
      `${fixtureName}.output.${extension}`
    )

    const fileInfo = {
      path: inputPath,
      source: fs.readFileSync(inputPath).toString()
    }

    global.buffers = []

    let transformation
    if (transformationType == 'both') {
      transformation = bothTransformationMap[transformationName]
      if (transformation.templateBeforeScript) {
        const med = {
          path: inputPath,
          source: runTransformation(fileInfo, transformation.vue)
        }
        expect(runTransformation(med, transformation.js)).toEqual(
          fs.readFileSync(outputPath).toString()
        )
      }
      {
        const med = {
          path: inputPath,
          source: runTransformation(fileInfo, transformation.js)
        }
        expect(runTransformation(med, transformation.vue)).toEqual(
          fs.readFileSync(outputPath).toString()
        )
      }
      return
    }

    if (transformationType == 'vue') {
      transformation = vueTransformationMap[transformationName]
    } else {
      transformation = transformationMap[transformationName]
    }
    expect(runTransformation(fileInfo, transformation)).toEqual(
      fs.readFileSync(outputPath).toString()
    )
  })
}
