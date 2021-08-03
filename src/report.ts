import { table } from 'table'
import cliProgress from 'cli-progress'

export const cliInstance = new cliProgress.SingleBar(
  {
    format: 'progress [{bar}] {percentage}% | {process} | {value}/{total}',
    clearOnComplete: false,
    linewrap: true,
    fps: 144
  },
  cliProgress.Presets.shades_classic
)
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
  let line
  let column
  if (node?.loc) {
    line = node?.loc?.start.line
    column = node?.loc?.start.column
  } else {
    line = node?.value?.loc?.start.line
    column = node?.value?.loc?.start.column
  }
  index = line + index
  let position: string = '[' + index + ',' + column + ']'

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
  console.log(
    `Processed ${processFilePath.length} files:\n${processFilePathList}\n`
  )

  if (global.manualList.length) {
    console.log(
      `The list that you need to migrate your codes manually (total: ${global.manualList.length}): `
    )
    let index = 1
    global.manualList.forEach(manual => {
      console.log('index:', index++)
      console.log(manual)
    })
  }

  console.log(
    '\n\n\x1B[31;4m%s\x1B[0m',
    `${totalDetected} places`,
    `need to be transformed`
  )
  console.log(
    '\x1B[32;4m%s\x1B[0m',
    `${totalChanged} places`,
    `was transformed`
  )
  console.log(`The transformation rate is \x1B[32;4m${transRate}%\x1B[0m`)

  Object.keys(outputReport).forEach(item => {
    if (!outputReport[item]) delete outputReport[item]
  })

  if (formatter === 'detail') {
    console.log('The transformation stats: \n')
    console.log(global.outputReport)
  } else {
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
    console.log('The transformation stats: ')
    console.log(tableStr)
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
  logger.log(
    `Processed ${processFilePath.length} files:\n${processFilePathList}\n`
  )
  if (global.manualList.length) {
    logger.log('The list that you need to migrate your codes manually')
    let index = 1
    global.manualList.forEach(manual => {
      logger.log('index:', index++)
      logger.log(manual)
    })
  }
  logger.log(`\n\n${totalDetected} places`, `need to be transformed`)
  logger.log(`${totalChanged} places`, `was transformed`)
  logger.log(`The transformation rate is ${transRate}%`)
  logger.log('The transformation stats: ')
  logger.log(tableStr)
}
