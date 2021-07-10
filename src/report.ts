import * as fs from 'fs'

export function getCntFunc(key: string, outputObj: { [key: string]: number }) {
  if (!outputObj) {
    outputObj = { key: 0 }
  }
  if (!outputObj.hasOwnProperty(key)) {
    outputObj[key] = 0
  }
  function cntFunc(quantity: number = 1) {
    outputObj[key] += quantity
  }
  return cntFunc
}

export function formatterOutput(processFilePath: string[], formatter: string) {
  // normal output
  const processFilePathList = processFilePath.join('\n')
  const totalChanged = Object.keys(global.outputReport).reduce(
    (sum, key) => sum + global.outputReport[key],
    0
  )
  const totalDetected = totalChanged
  const transRate =
    totalDetected == totalChanged ? 100 : (100 * totalChanged) / totalDetected

  console.log(`--------------------------------------------------`)
  console.log(`Processed file:\n${processFilePathList}`)
  console.log(`Processed ${processFilePath.length} files`)

  console.log(
    '\x1B[44;37;4m%s\x1B[0m',
    `${totalDetected} places`,
    `need to be transformed`
  )
  console.log(
    '\x1B[44;37;4m%s\x1B[0m',
    `${totalChanged} places`,
    `was transformed`
  )
  console.log(`The transformation rate is \x1B[44;37;4m${transRate}%\x1B[0m`)

  if (formatter === 'all') {
    console.log('The transformation stats: \n')
    console.log(global.outputReport)
  }

  Object.keys(outputReport).forEach(item => {
    if (!outputReport[item]) delete outputReport[item]
  })

  if (formatter === 'detail') {
    console.log('The transformation stats: \n')
    console.log(global.outputReport)
  }

  if (formatter === 'table') {
    console.log('The transformation stats: \n')
    console.table(global.outputReport)
  }

  if (formatter === 'log') {
    logOutput(
      processFilePathList,
      processFilePath,
      totalDetected,
      totalChanged,
      transRate
    )
  }
}

export function logOutput(
  processFilePathList: string,
  processFilePath: string[],
  totalDetected: number,
  totalChanged: number,
  transRate: number
) {
  let options = {
    flags: 'w', //
    encoding: 'utf8' // utf8编码
  }

  let stdout = fs.createWriteStream('./vue_codemod.log', options)

  let logger = new console.Console(stdout)

  logger.log(`--------------------------------------------------`)
  logger.log(`Processed file:\n${processFilePathList}\n`)
  logger.log(`Processed ${processFilePath.length} files`)
  logger.log(`${totalDetected} places`, `need to be transformed`)
  logger.log(`${totalChanged} places`, `was transformed`)
  logger.log(`The transformation rate is ${transRate}%`)
  logger.log('The transformation stats: \n', global.outputReport)
}
