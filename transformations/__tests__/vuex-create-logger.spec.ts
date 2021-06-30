import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../vuex-create-logger')

defineInlineTest(
  transform,
  {},
  `import createLogger from 'vuex/dist/logger'
const store = new Vuex.Store({
  plugins: [createLogger()]
})`,
  `import { createLogger } from "vuex";
const store = new Vuex.Store({
  plugins: [createLogger()]
})`,
  'vuex createLogger'
)

defineInlineTest(
  transform,
  {},
  `import logger from 'vuex/dist/logger'
const store = new Vuex.Store({
  plugins: [logger()]
})`,
  `import { createLogger } from "vuex";
const store = new Vuex.Store({
  plugins: [createLogger()]
})`,
  'vuex createLogger another name'
)
