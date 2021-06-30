import { Node, VElement } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import type { VueASTTransformation } from '../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../src/wrapVueTransformation'

export const transformAST: VueASTTransformation = context => {
  let fixOperations: Operation[] = []
  const { file } = context
  const source = file.source
  const toFixNodes: Node[] = findNodes(context)
  toFixNodes.forEach(node => {
    fixOperations = fixOperations.concat(fix(node, source))
  })
  return fixOperations
}

export default wrap(transformAST)

function findNodes(context: any): Node[] {
  const { file } = context
  const source = file.source
  const options = { sourceType: 'module' }
  const ast = parser.parse(source, options)
  let toFixNodes: Node[] = []
  let root: Node = <Node>ast.templateBody

  // find router-link nodes
  parser.AST.traverseNodes(root, {
    enterNode(node: Node) {
      if (node.type === 'VElement' && node.name === 'router-link') {
        toFixNodes.push(node)
      }
    },
    leaveNode(node: Node) {}
  })

  return toFixNodes
}

function fix(node: Node, source: string): Operation[] {
  node = <VElement>node
  let fixOperations: Operation[] = []

  // remove 'exact' attribute in router-link
  node.startTag.attributes.forEach(attr => {
    if (attr.type === 'VAttribute' && attr.key.name === 'exact') {
      fixOperations.push(OperationUtils.remove(attr))
    }
  })

  return fixOperations
}
