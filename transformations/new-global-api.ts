import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as vueAsNamespaceImport } from './vue-as-namespace-import'
import { transformAST as importCompositionApiFromVue } from './import-composition-api-from-vue'
import { transformAST as newVueTocreateApp } from './new-vue-to-create-app'
import { transformAST as rootPropToUse } from './root-prop-to-use'
import { transformAST as removeTrivialRoot } from './remove-trivial-root'
import { transformAST as removeProductionTip } from './remove-production-tip'
import { transformAST as removeVueUse } from './remove-vue-use'
import { transformAST as removeContextualHFromRender } from './remove-contextual-h-from-render'

import { transformAST as removeExtraneousImport } from './remove-extraneous-import'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = context => {
  const newVueCount = subRules['new-vue-to-create-app']
    ? subRules['new-vue-to-create-app']
    : 0
  const remHCount = subRules['remove-contextual-h-from-render']
    ? subRules['remove-contextual-h-from-render']
    : 0
  const beforeCount = newVueCount + remHCount
  vueAsNamespaceImport(context)
  importCompositionApiFromVue(context)
  newVueTocreateApp(context)
  rootPropToUse(context, { rootPropName: 'store' })
  rootPropToUse(context, { rootPropName: 'router' })
  rootPropToUse(context, { rootPropName: 'i18n' })
  rootPropToUse(context, { rootPropName: '', isGlobalApi: true })
  removeTrivialRoot(context)
  removeProductionTip(context)

  // TODO:
  // should analyze the AST to get the default import of vue-router and vuex,
  // rather than hard-coding the names
  removeVueUse(context, {
    removablePlugins: ['VueRouter', 'Vuex', 'VueCompositionApi', 'VueI18n']
  })
  removeContextualHFromRender(context) // count

  removeExtraneousImport(context, { localBinding: 'Vue' })
  removeExtraneousImport(context, { localBinding: 'Vuex' })
  removeExtraneousImport(context, { localBinding: 'VueRouter' })
  const afterCount =
    subRules['new-vue-to-create-app'] +
    subRules['remove-contextual-h-from-render']
  const change = afterCount - beforeCount
  const cntFunc = getCntFunc('new-global-api', outputReport)
  cntFunc(change)
}

export default wrap(transformAST)
export const parser = 'babylon'
