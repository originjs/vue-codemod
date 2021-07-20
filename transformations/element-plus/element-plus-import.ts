import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { getCntFunc } from '../../src/report'

/**
 * Upgrade element-ui to element-plus
 * @param content
 */
export const transformAST: ASTTransformation = ({ root, j }) => {
  // find element-ui import
  const elementPlusImport = root.find(j.ImportDeclaration, {
    source: {
      value: 'element-ui'
    }
  })

  if (elementPlusImport.length) {
    elementPlusImport.forEach(({ node }) => {
      node.source.value = 'element-plus'
    })

    // stats
    const cntFunc = getCntFunc('observable', subRules)
    cntFunc()
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
