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
  'remove-listeners'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.key.type === 'VDirectiveKey' &&
    node.key.name.name === 'on' &&
    node.value?.type === 'VExpressionContainer' &&
    node.value.expression?.type === 'Identifier' &&
    node.value.expression.name === '$listeners'
  )
}

function fix(node: Node): Operation[] {
  let fixOperations: Operation[] = []
  fixOperations.push(OperationUtils.remove(node))
  return fixOperations
}
