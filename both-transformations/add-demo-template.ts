import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

export const transformAST = createTransformAST(nodeFilter, fix, 'add-demo')

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VElement' &&
    node.name === 'p' &&
    node.startTag?.attributes[0]?.key.name === 'id' &&
    // @ts-ignore
    node.startTag?.attributes[0]?.value.value ===
      'target_id_for_the_test_must_be_unique'
  )
}

function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []
  fixOperations.push(
    // @ts-ignore
    OperationUtils.replaceText(node?.children[0], global.buffers[0].msg)
  )

  return fixOperations
}
