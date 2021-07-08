import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { getCntFunc } from '../src/report'

// import Vue from 'vue' -> import * as Vue from 'vue'
export const transformAST: ASTTransformation = ({ j, root }) => {
  const cntFunc = getCntFunc('vue-as-namespace-import')
  const importDecl = root.find(j.ImportDeclaration, {
    source: {
      value: 'vue'
    }
  })

  importDecl.find(j.ImportDefaultSpecifier).replaceWith(({ node }) => {
    cntFunc()
    return j.importNamespaceSpecifier(node.local)
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
