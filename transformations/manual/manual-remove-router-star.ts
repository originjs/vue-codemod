import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { pushManualList } from '../../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context

  const rootNodes: any = root.find(j.ObjectProperty, {
    key: {
      name: 'path'
    },
    value: {
      value: '*'
    }
  })
  if (rootNodes) {
    rootNodes.forEach((node: any) => {
      const path = filename
      const name = 'remove * routes'
      const suggest =
        'Catch all routes (*, /*) must now be defined using a parameter with a custom regex: '
      const website =
        'https://next.router.vuejs.org/guide/migration/index.html#removal-of-the-fallback-option'
      pushManualList(path, node, name, suggest, website)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
