import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import type { VueASTTransformation } from '../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../src/wrapVueTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: VueASTTransformation = context => {
  const cntFunc = getCntFunc('slot-scope-attribute')
  let fixOperations: Operation[] = []
  const toFixNodes: Node[] = findNodes(context)
  const { file } = context
  const source = file.source
  toFixNodes.forEach(node => {
    const operations = fix(node, source)
    if (operations.length) {
      cntFunc()
      fixOperations = fixOperations.concat(operations)
    }
  })
  return fixOperations
}

export default wrap(transformAST)
/**
 * search slot attribute nodes
 *
 * @param context
 * @returns slot attribute nodes
 */
function findNodes(context: any): Node[] {
  const { file } = context
  const source = file.source
  const options = { sourceType: 'module' }
  const ast = parser.parse(source, options)
  let toFixNodes: Node[] = []
  let root: Node = <Node>ast.templateBody
  parser.AST.traverseNodes(root, {
    enterNode(node: Node) {
      if (
        node.type === 'VAttribute' &&
        node.directive &&
        node.key.name.name === 'slot-scope'
      ) {
        toFixNodes.push(node)
      }
    },
    leaveNode(node: Node) {}
  })
  return toFixNodes
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
