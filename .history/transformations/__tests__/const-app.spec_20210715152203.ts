import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../new-directive-api')

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
