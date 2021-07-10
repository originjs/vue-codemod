import * as OperationUtils from '../src/operationUtils'
import type { Node } from 'vue-eslint-parser/ast/nodes'
import type { Operation } from '../src/operationUtils'
import createDebug from 'debug'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

const debug = createDebug('vue-codemod:rule')

export const transformAST = createTransformAST(
  nodeFilter,
  fix,
  'transition-group-root'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  // filter for slot attribute node
  return node.type === 'VElement' && node.name === 'transition-group'
}

/**
 * The repair logic for
 * @param node The Target Node
 */
function fix(node: any): Operation[] {
  let fixOperations: Operation[] = []

  // The current node has no attribute that is v-for
  let hasTagAttr: boolean = false
  node.startTag.attributes
    .filter(
      (attr: any) =>
        attr.type === 'VAttribute' &&
        attr.key.type === 'VIdentifier' &&
        attr.key.name === 'tag'
    )
    .forEach((element: any) => {
      hasTagAttr = true
    })
  if (hasTagAttr) {
    debug('No operator, transition-group element has tag attribute.')
    return fixOperations
  }

  fixOperations.push(
    OperationUtils.insertTextAt(node.startTag.range[1] - 1, ' tag="span"')
  )
  return fixOperations
}
