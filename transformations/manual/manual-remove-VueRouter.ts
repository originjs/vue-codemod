import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { pushManualList } from '../../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context

  const rootNodes: any = root.find(j.Identifier, {
    name: 'VueRouter'
  })
  if (rootNodes) {
    rootNodes.forEach((node: any) => {
      const path = filename
      const name = 'remove VueRouter'
      const suggest =
        "The rule of thumb is any APIs that globally mutate VueRouter's behavior are now moved to the app instance. "
      const website =
        'https://next.router.vuejs.org/guide/migration/index.html#moved-the-base-option'
      pushManualList(path, node, name, suggest, website)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
