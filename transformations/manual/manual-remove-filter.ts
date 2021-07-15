import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { pushManualList } from '../../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context

  const rootNodes: any = root
    .find(j.Identifier, {
      name: 'filters'
    })
    .filter((node: any) => node?.value.property?.name !== 'createApp')
  if (rootNodes) {
    rootNodes.forEach((node: any) => {
      const path = filename
      const name = 'remove filters'
      const suggest =
        'Filters are removed from Vue 3.0 and no longer supported. '
      const website =
        'https://v3.vuejs.org/guide/migration/filters.html#overview'
      pushManualList(path, node, name, suggest, website)
    })
  }

  const rootNodes2: any = root.find(j.MemberExpression, {
    object: {
      name: 'Vue'
    },
    property: {
      name: 'filter'
    }
  })
  if (rootNodes2) {
    rootNodes2.forEach((node: any) => {
      const path = filename
      const name = 'remove global filters'
      const suggest =
        'Instead, you can make your global filters available to all components through globalProperties: '
      const website =
        'https://v3.vuejs.org/guide/migration/filters.html#global-filters'
      pushManualList(path, node, name, suggest, website)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
