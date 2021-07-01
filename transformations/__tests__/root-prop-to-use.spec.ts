import { defineInlineTest } from 'jscodeshift/src/testUtils'
import type { GlobalApi } from '../../src/global'
const transform = require('../root-prop-to-use')

global.globalApi = []
let api1: GlobalApi = {
  name: 'api1',
  path: 'src/directive/permission/api1.js'
}
let api2: GlobalApi = { name: 'api2', path: 'src/directive/api2.js' }
global.globalApi.push(api1)
global.globalApi.push(api2)

defineInlineTest(
  transform,
  {
    rootPropName: 'router',
  },
  `createApp({ router });`,
  `createApp({}).use(router);`,
  'correctly transform root `router` prop to `.use(router)`'
)

defineInlineTest(
  transform,
  {
    rootPropName: 'router',
  },
  `Vue.createApp({ router });`,
  `Vue.createApp({}).use(router);`,
  'Can recognize Vue.createApp'
)

defineInlineTest(
  transform,
  {
    rootPropName: 'router',
  },
  `createApp({});`,
  `createApp({});`
)

defineInlineTest(
  transform,
  { rootPropName: '', isGlobalApi: true },
  `Vue.createApp();`,
  `import api1 from "../src/directive/permission/api1.js";
import api2 from "../src/directive/api2.js";
Vue.createApp().use(api1).use(api2);`,
  'Can recognize global api use'
)

defineInlineTest(
  transform,
  { rootPropName: '', isGlobalApi: true },
  `import Comp1 from "./Comp1.vue"
  export default {
    install: app => {
      app.component("comp1", Comp1);
    }
  }`,
  `import Comp1 from "./Comp1.vue"
  export default {
    install: app => {
      app.component("comp1", Comp1);
    }
  }`,
  'No target Approots, jump out of this transition. '
)
