import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as addImport } from './add-import'
import { getCntFunc } from '../src/report'

/**
 * import VueI18n from 'vue-i18n' -> import { createI18n } from 'vue-i18n'
 * new VueI18n() -> createI18n()
 * @param context
 */
export const transformAST: ASTTransformation = context => {
  const { root, j } = context
  const cntFunc = getCntFunc('vue-i18n-v9', global.outputReport)
  // find import
  const vueI18nImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'vue-i18n'
    }
  })
  const importedVueI18n = vueI18nImportDecls.find(j.ImportDefaultSpecifier)

  if (!importedVueI18n.length) {
    return
  }

  // might use alias when import, get the real import name
  const localVueI18n = importedVueI18n.get(0).node.local.name

  // import VueI18n from 'vue-i18n' -> import { createI18n } from 'vue-i18n'
  if (vueI18nImportDecls) {
    cntFunc()
    vueI18nImportDecls.remove()
    addImport(context, {
      specifier: { type: 'named', imported: 'createI18n' },
      source: 'vue-i18n'
    })
  }

  // new VueI18n() -> createI18n()
  const newVueI18n = root.find(j.NewExpression, {
    callee: {
      type: 'Identifier',
      name: localVueI18n
    }
  })
  if (newVueI18n) {
    newVueI18n.replaceWith(({ node }) => {
      return j.callExpression(j.identifier('createI18n'), node.arguments)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
