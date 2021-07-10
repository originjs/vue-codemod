import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

export const transformAST = createTransformAST(
  nodeFilter,
  fix,
  'remove-v-on-native'
)

export default wrap(transformAST)

/**
 * Filter for v-on nodes
 */
function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' && node.directive && node.key.name.name === 'on'
  )
}

/**
 * fix logic
 * @param node
 */
function fix(node: Node): Operation[] {
  let fixOperations: Operation[] = []
  // @ts-ignore
  const keyNode = node.key
  const argument = keyNode.argument
  const modifiers = keyNode.modifiers

  if (argument !== null) {
    modifiers.forEach((mod: any) => {
      if (mod?.name === 'native') {
        const comment =
          '<!-- native modifier has been removed, please confirm whether the function has been affected  -->'
        const vStartTag = mod.parent.parent.parent
        const vElement = vStartTag.parent
        const siblings = vElement.parent.children
        let insertIndent = ''
        if (siblings[0] !== vElement) {
          let preEle = siblings[0]
          for (let i = 1; i < siblings.length; i++) {
            if (siblings[i].range === vElement.range) {
              insertIndent = preEle.value
              break
            } else {
              preEle = siblings[i]
            }
          }
        }
        // insert a comment about navite modifier
        fixOperations.push(OperationUtils.insertTextBefore(vStartTag, comment))
        // insert new line and indents
        fixOperations.push(
          OperationUtils.insertTextBefore(vStartTag, insertIndent)
        )
        // remove native modifier on 'v-on' directive
        fixOperations.push(
          OperationUtils.removeRange([mod.range[0] - 1, mod.range[1]])
        )
      }
    })
  }

  return fixOperations
}
