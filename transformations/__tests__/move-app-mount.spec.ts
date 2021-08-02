import { defineInlineTest } from 'jscodeshift/src/testUtils'

const transform = require('../move-app-mount')


defineInlineTest(
  transform,
  {},
  `app.directive('demo', {})
const app = Vue.createApp(App).use(button_counter).use(router).use(store);
app.mount("#app");
app.component('myComponent',{})
app.config.globalProperties.$filters = {
    myFilter(value) {
        if (!value)return ''
        return value.toUpperCase()
    }
};`,
  `const app = Vue.createApp(App).use(button_counter).use(router).use(store);
app.directive('demo', {})
app.component('myComponent',{})
app.config.globalProperties.$filters = {
    myFilter(value) {
        if (!value)return ''
        return value.toUpperCase()
    }
};
app.mount("#app");`,
  'move app.mount to after all the app.* '
)

defineInlineTest(
  transform,
  {},
  `Vue.directive('demo', {})
Vue.createApp(App).use(button_counter).use(router).use(store).mount("#app");
Vue.component('myComponent',{})
`,
  `Vue.directive('demo', {})
Vue.createApp(App).use(button_counter).use(router).use(store).mount("#app");
Vue.component('myComponent',{})`,
  'do not change the code without app.mount'
)
