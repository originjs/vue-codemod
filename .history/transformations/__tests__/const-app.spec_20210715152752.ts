import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../const-app')

defineInlineTest(
  transform,
  {},
  `Vue.createApp(App).use(button_counter).use(router).use(store).mount('#app')
})`,
  `const app = Vue.createApp(App).use(button_counter).use(router).use(store);
  const app = app;
})`,
  'test'
)


// TODO: VNode API
