import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../const-app')

defineInlineTest(
  transform,
  {},
  `Vue.createApp(App).use(button_counter).use(router).use(store).mount('#app')
})`,
  `
})`,
  ''
)


// TODO: VNode API
