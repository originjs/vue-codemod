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
  'slot-scope-attribute'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  // filter for slot attribute node
  return (
    node.type === 'VAttribute' &&
    node.directive &&
    node.key.name.name === 'slot-scope'
  )
}

/**
 * fix logic
 * @param node
 */
function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []
  const element: any = node!.parent!.parent
  // @ts-ignore
  const scopeValue: string = OperationUtils.getText(node.value, source)

  if (!!element && element.type == 'VElement' && element.name == 'template') {
    // template element replace slot-scope="xxx" to v-slot="xxx"
    fixOperations.push(OperationUtils.replaceText(node, `v-slot=${scopeValue}`))
  }

  return fixOperations
}
