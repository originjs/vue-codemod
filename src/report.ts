import { table } from 'table'

export function pushManualList(
  path: string,
  node: any,
  name: string,
  suggest: string,
  website: string
) {
  let index = 0
  const filepath = path.split('.')
  if (filepath[filepath.length - 1] === 'vue') {
    index = global.scriptLine - 1
  } else {
    index = 0
  }
  index = node?.value.loc?.start.line + index
  let position: string = '[' + index + ',' + node?.value.loc?.start.column + ']'

  const list = {
    path: path,
    position: position,
    name: name,
    suggest: suggest,
    website: website
  }
  global.manualList.push(list)
}

export function VuePushManualList(
  path: string,
  node: any,
  name: string,
  suggest: string,
  website: string
) {
  let position: string =
    '[' + node?.loc?.start.line + ',' + node?.loc?.start.column + ']'
  const list = {
    path: path,
    position: position,
    name: name,
    suggest: suggest,
    website: website
  }
  global.manualList.push(list)
}

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

export function formatterOutput(
  processFilePath: string[],
  formatter: string,
  logger: Console
) {
  // normal output
  const processFilePathList = processFilePath.join('\n')
  const totalChanged = Object.keys(global.outputReport).reduce(
    (sum, key) => sum + global.outputReport[key],
    0
  )
  const totalDetected = totalChanged + global.manualList.length
  const transRate =
    totalDetected == totalChanged
      ? 100
      : ((100 * totalChanged) / totalDetected).toFixed(2)

  console.log(`\x1B[0m--------------------------------------------------`)
  console.log(`Processed file:\n${processFilePathList}`)
  console.log(`Processed ${processFilePath.length} files`)

  console.log(
    '\x1B[31;4m%s\x1B[0m',
    `${totalDetected} places`,
    `need to be transformed`
  )
  console.log(
    '\x1B[32;4m%s\x1B[0m',
    `${totalChanged} places`,
    `was transformed`
  )
  console.log(`The transformation rate is \x1B[32;4m${transRate}%\x1B[0m`)

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

  let tableStr: string
  let tableOutput: any[][] = [['Rule Names', 'Count']]
  for (let i in global.outputReport) {
    tableOutput.push([i, global.outputReport[i]])
  }
  tableStr = table(tableOutput, {
    drawHorizontalLine: (lineIndex, rowCount) => {
      return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount
    },
    columns: [{ alignment: 'left' }, { alignment: 'center' }]
  })

  if (formatter === 'table') {
    console.log('The transformation stats: \n')
    console.log(tableStr)
  }

  if (formatter === 'log') {
    logOutput(
      processFilePathList,
      processFilePath,
      totalDetected,
      totalChanged,
      transRate,
      tableStr,
      logger
    )
  }

  if (global.manualList.length) {
    console.log('The list that you need to migrate your codes manually: ')
    let index = 1
    global.manualList.forEach(manual => {
      console.log('index:', index++)
      console.log(manual)
    })
  }
}

export function logOutput(
  processFilePathList: string,
  processFilePath: string[],
  totalDetected: number,
  totalChanged: number,
  transRate: string | number,
  tableStr: string,
  logger: Console
) {
  logger.log(`--------------------------------------------------`)
  logger.log(`Processed file:\n${processFilePathList}\n`)
  logger.log(`Processed ${processFilePath.length} files`)
  logger.log(`${totalDetected} places`, `need to be transformed`)
  logger.log(`${totalChanged} places`, `was transformed`)
  logger.log(`The transformation rate is ${transRate}%`)
  logger.log('The transformation stats: \n')
  logger.log(tableStr)
  if (global.manualList.length) {
    logger.log('The list that you need to migrate your codes manually')
    let index = 1
    global.manualList.forEach(manual => {
      logger.log('index:', index++)
      logger.log(manual)
    })
  }
}
