import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'

export const transformAST: ASTTransformation = ({ root, j }) => {
  const importValuePrefix = 'element-plus/lib/locale/lang/'
  // find element-ui lang import
  const langImport = root.find(j.ImportDeclaration, node => {
    return (
      node.source.type === 'StringLiteral' &&
      node.source.value?.startsWith(importValuePrefix)
    )
  })

  if (langImport.length) {
    langImport.replaceWith(({ node }) => {
      const value = node.source.value as string
      const lang = value.replace(importValuePrefix, '')
      // if lang contains upper-case,converts to lower-case
      if (/[A-Z]+/.test(lang)) {
        node.source.value = importValuePrefix + lang.toLowerCase()
      }
      return node
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
