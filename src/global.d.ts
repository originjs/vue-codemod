// Custom global variables
export type GlobalApi = {
  name: string
  path: string
}

declare global {
  // Use to add global variables used by components to main.js
  var globalApi: GlobalApi[]
  var outputReport: { [key: string]: number }
  var subRules: { [key: string]: number }
}

export {}
