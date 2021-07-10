import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

export const transformAST = createTransformAST(nodeFilter, fix, 'v-bind-sync')

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.directive &&
    node.key.name.name === 'bind'
  )
}

/**
 * fix logic
 * @param node
 */
function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []
  // @ts-ignore
  const keyNode = node.key
  const argument = keyNode.argument
  const modifiers = keyNode.modifiers
  const bindArgument = OperationUtils.getText(argument, source)

  if (
    argument !== null &&
    modifiers.length === 1 &&
    modifiers[0].name === 'sync'
  ) {
    // .sync modifiers in v-bind should be replaced with v-model
    fixOperations.push(
      OperationUtils.replaceText(keyNode, `v-model:${bindArgument}`)
    )
  }

  return fixOperations
}
