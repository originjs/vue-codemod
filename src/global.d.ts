// Custom global variables
export type GlobalApi = {
  name: string
  path: string
}

export type ManualList = {
  path: string
  position: string
  name: string
  suggest: string
  website: string
}

declare global {
  // Use to add global variables used by components to main.js
  var globalApi: GlobalApi[]
  var manualList: ManualList[]
  var scriptLine: number
  var outputReport: { [key: string]: number }
  var subRules: { [key: string]: number }
}

export {}
