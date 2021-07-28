jest.autoMockOff()

import * as fs from 'fs'
import * as path from 'path'
import runTransformation from './runTransformation'
import transformationMap from '../transformations'
import vueTransformationMap from '../vue-transformations'

export const runTest = (
  description: string,
  transformationName: string,
  fixtureName: string,
  extension: string = 'vue',
  transformationType: string = 'vue'
) => {
  test(description, () => {
    const fixtureDir = path.resolve(
      __dirname,
      transformationType == 'vue'
        ? '../vue-transformations'
        : '../wrapAstTransformation',
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
    const transformation = (
      transformationType == 'vue' ? vueTransformationMap : transformationMap
    )[transformationName]
    expect(runTransformation(fileInfo, transformation)).toEqual(
      fs.readFileSync(outputPath).toString()
    )
  })
}
