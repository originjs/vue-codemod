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
  'popover-rename-attribute'
)
export default wrap(transformAST)

const renameMap: Map<string, string> = new Map([
  ['open-delay', 'show-after'],
  ['close-delay', 'hide-after']
])

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VIdentifier' &&
    renameMap.has(node.name) &&
    node.parent?.parent?.parent?.type === 'VElement' &&
    node.parent?.parent?.parent?.name === 'el-popover'
  )
}

function fix(node: VIdentifier): Operation[] {
  let fixOperations: Operation[] = []
  // @ts-ignore
  fixOperations.push(OperationUtil.replaceText(node, renameMap.get(node.name)))
  return fixOperations
}
