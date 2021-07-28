import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { getCntFunc } from '../../src/report'

/**
 * Upgrade element-ui to element-plus
 * @param content
 */
export const transformAST: ASTTransformation = ({ root, j }) => {
  const cntFunc = getCntFunc('element-plus-import', subRules)
  // find element-ui import
  const elementPlusImport = root.find(j.ImportDeclaration, node => {
    return node.source.value.toString().startsWith('element-ui')
  })
  if (elementPlusImport.length) {
    elementPlusImport.forEach(({ node }) => {
      node.source.value =
        'element-plus' +
        node.source.value?.toString().substring('element-ui'.length)
    })
    cntFunc()
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
