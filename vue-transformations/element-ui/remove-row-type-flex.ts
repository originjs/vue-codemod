import { Node, VIdentifier } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtil from '../../src/operationUtils'
import type { Operation } from '../../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../../src/wrapVueTransformation'

export const transformAST = createTransformAST(
  nodeFilter,
  fix,
  'remove-row-type-flex'
)
export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.parent?.parent?.type === 'VElement' &&
    node.parent.parent.name === 'el-row' &&
    node.key?.type === 'VIdentifier' &&
    node.key.name === 'type' &&
    node.value?.type === 'VLiteral' &&
    node.value.value === 'flex'
  )
}

function fix(node: VIdentifier): Operation[] {
  let fixOperations: Operation[] = []
  fixOperations.push(OperationUtil.remove(node))
  // @ts-ignore
  return fixOperations
}
