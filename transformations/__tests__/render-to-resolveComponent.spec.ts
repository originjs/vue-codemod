import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../render-to-resolveComponent')

defineInlineTest(
  transform,
  {},
  `export default {
  render(h){
    return h('button-counter')
  }
}`,
  `
import { resolveComponent, h } from "vue";
export default {
  render() {
    const buttonCounter = resolveComponent('button-counter')
    return h(buttonCounter);
  }
}`,
  'transform render-to-resolveComponent'
)
