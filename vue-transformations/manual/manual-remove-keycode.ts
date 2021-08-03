import { Node } from 'vue-eslint-parser/ast/nodes'
import type { Operation } from '../../src/operationUtils'
import type { VueASTTransformation } from '../../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../../src/wrapVueTransformation'
import { VuePushManualList } from '../../src/report'

export const transformAST: VueASTTransformation = context => {
  let fixOperations: Operation[] = []
  findNodes(context)
  return fixOperations
}

export default wrap(transformAST)

function findNodes(context: any) {
  const { file } = context
  const source = file.source
  const options = { sourceType: 'module' }
  const ast = parser.parse(source, options)
  let toFixNodes: Node[] = []
  let root: Node = <Node>ast.templateBody
  let key = /^key{1}/
  let number = /^\d+/
  parser.AST.traverseNodes(root, {
    enterNode(node: Node) {
      if (
        node.type === 'VDirectiveKey' &&
        node?.name?.name === 'on' &&
        // @ts-ignore
        key.test(node?.argument?.name) &&
        number.test(node?.modifiers[0]?.name)
      ) {
        toFixNodes.push(node)
      }
    },
    leaveNode(node: Node) {}
  })

  toFixNodes.forEach(node => {
    const path = file.path
    const name = 'remove keycode'
    const suggest =
      'Using numbers, i.e. keyCodes, as v-on modifiers is no longer supported'
    const website =
      'https://v3.vuejs.org/guide/migration/keycode-modifiers.html'
    VuePushManualList(path, node, name, suggest, website)
  })
}
