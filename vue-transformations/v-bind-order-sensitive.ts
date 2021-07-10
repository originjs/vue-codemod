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
  'v-bind-order-sensitive'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.directive &&
    node.key.name.name === 'bind' &&
    node.parent.attributes.length > 1
  )
}

function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []
  // get parent node
  const target: any = node!.parent
  // get the value of v-bind according to the range
  const bindValue: string = source.slice(node.range[0], node.range[1]) + ' '
  // remove node
  if (target.attributes[target.attributes.length - 1] === node) {
    fixOperations.push(OperationUtils.remove(node))
  } else {
    fixOperations.push(
      OperationUtils.removeRange([node.range[0], node.range[1] + 1])
    )
  }
  // add node to the first
  fixOperations.push(
    OperationUtils.insertTextBefore(target.attributes[0], bindValue)
  )
  return fixOperations
}
