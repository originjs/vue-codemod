import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import type {
  ImportSpecifier,
  ImportDefaultSpecifier
} from 'ast-types/gen/nodes'
import { getCntFunc } from '../../src/report'

/**
 * Process component names that have been changed in element plus
 * @param content
 */
export const transformAST: ASTTransformation = ({ root, j }) => {
  // find element-ui import
  const elementPlusImport = root.find(j.ImportDeclaration, {
    source: {
      value: 'element-plus'
    }
  })

  if (elementPlusImport.length) {
    elementPlusImport.forEach(({ node }) => {
      let newSpecifier: (ImportSpecifier | ImportDefaultSpecifier)[] = []
      node.specifiers.forEach(importNode => {
        if (importNode.type === 'ImportSpecifier') {
          newSpecifier.push(
            j.importSpecifier(
              j.identifier('El' + importNode.local?.name),
              importNode.local
            )
          )
          node.specifiers = newSpecifier
        } else {
          newSpecifier.push(
            j.importDefaultSpecifier(j.identifier(importNode.local!.name))
          )
          node.specifiers = newSpecifier
        }
      })
    })

    // stats
    const cntFunc = getCntFunc('observable', subRules)
    cntFunc()
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
