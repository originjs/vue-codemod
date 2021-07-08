import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import type { VueASTTransformation } from '../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../src/wrapVueTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: VueASTTransformation = context => {
  const cntFunc = getCntFunc('v-bind-sync')
  let fixOperations: Operation[] = []
  const { file } = context
  const source = file.source
  const toFixNodes: Node[] = findNodes(context)
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
 * search v-bind attribute nodes
 *
 * @param context
 * @returns v-bind attribute nodes
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
        node.key.name.name === 'bind'
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
