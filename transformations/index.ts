import type { Transform, Parser } from 'jscodeshift'

type JSTransformationModule = {
  default: Transform
  parser?: string | Parser
}

const transformationMap: {
  [name: string]: JSTransformationModule
} = {
  'vue-class-component-v8': require('./vue-class-component-v8'),
  'new-global-api': require('./new-global-api'),
  'vue-router-v4': require('./vue-router-v4'),
  'vuex-v4': require('./vuex-v4'),
  'define-component': require('./define-component'),
  'new-vue-to-create-app': require('./new-vue-to-create-app'),
  'scoped-slots-to-slots': require('./scoped-slots-to-slots'),
  'new-directive-api': require('./new-directive-api'),
  'remove-vue-set-and-delete': require('./remove-vue-set-and-delete'),
  'rename-lifecycle': require('./rename-lifecycle'),
  'add-emit-declaration': require('./add-emit-declaration'),
  'global-filter': require('./global-filter'),
  'tree-shaking': require('./tree-shaking'),
  'v-model': require('./v-model'),
  'render-to-resolveComponent': require('./render-to-resolveComponent'),
  'vue-i18n-v9': require('./vue-i18n-v9'),

  // atomic ones
  'remove-contextual-h-from-render': require('./remove-contextual-h-from-render'),
  'remove-production-tip': require('./remove-production-tip'),
  'remove-trivial-root': require('./remove-trivial-root'),
  'remove-vue-use': require('./remove-vue-use'),
  'root-prop-to-use': require('./root-prop-to-use'),
  'vue-as-namespace-import': require('./vue-as-namespace-import'),

  // generic utility tranformations
  'add-import': require('./add-import'),
  'remove-extraneous-import': require('./remove-extraneous-import'),

  'router-update-addRoute': require('./router/router-update-addRoute')
}

export const excludedTransformations = [
  'define-component',
  'new-vue-to-create-app',
  'remove-contextual-h-from-render',
  'remove-production-tip',
  'remove-trivial-root',
  'remove-vue-use',
  'root-prop-to-use',
  'vue-as-namespace-import',
  'add-import',
  'remove-extraneous-import'
]

export default transformationMap
