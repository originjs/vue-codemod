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
  'popconfirm-rename-event'
)
export default wrap(transformAST)

const renameMap: Map<string, string> = new Map([
  ['onconfirm', 'confirm'],
  ['oncancel', 'cancel']
])

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VIdentifier' &&
    node.parent?.type === 'VDirectiveKey' &&
    node.parent?.name?.type === 'VIdentifier' &&
    node.parent?.name?.name === 'on' &&
    renameMap.has(node.name) &&
    node.parent?.parent?.parent?.parent?.type === 'VElement' &&
    node.parent?.parent?.parent?.parent?.name === 'el-popconfirm'
  )
}

function fix(node: VIdentifier): Operation[] {
  let fixOperations: Operation[] = []
  // @ts-ignore
  fixOperations.push(OperationUtil.replaceText(node, renameMap.get(node.name)))
  return fixOperations
}
