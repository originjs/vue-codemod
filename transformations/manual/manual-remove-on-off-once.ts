import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { pushManualList } from '../../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context

  const rootNodes: any = root
    .find(j.Identifier)
    .filter(
      node =>
        node.value.name === '$on' ||
        node.value.name === '$once' ||
        node.value.name === '$off'
    )
  if (rootNodes) {
    rootNodes.forEach((node: any) => {
      const path = filename
      const name = 'remove $on $once and $off'
      const suggest =
        '$on, $off and $once instance methods are removed. Component instances no longer implement the event emitter interface. '
      const website =
        'https://v3.vuejs.org/guide/migration/events-api.html#overview'
      pushManualList(path, node, name, suggest, website)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
