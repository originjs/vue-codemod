import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { pushManualList } from '../../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context

  const rootNodes: any = root.find(j.MemberExpression, {
    object: {
      object: {
        name: 'Vue'
      },
      property: {
        name: 'config'
      }
    },
    property: {
      name: 'KeyCodes'
    }
  })
  if (rootNodes) {
    rootNodes.forEach((node: any) => {
      const path = filename
      const name = 'remove keycodes'
      const suggest = 'config.keyCodes is no longer supported '
      const website =
        'https://v3.vuejs.org/guide/migration/keycode-modifiers.html'
      pushManualList(path, node, name, suggest, website)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
