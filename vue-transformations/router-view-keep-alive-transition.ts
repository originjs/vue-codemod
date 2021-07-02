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

  // find transition nodes
  parser.AST.traverseNodes(root, {
    enterNode(node: Node) {
      if (
        node.type === 'VElement' &&
        node.name === 'transition' &&
        node.children.length
      ) {
        toFixNodes.push(node)
      }
    },
    leaveNode(node: Node) {}
  })

  return toFixNodes
}

function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []

  // find transition nodes which contain router-view node.
  // note that router-view tag may under the keep-alive tag
  let routerView
  const children = (<VElement>node).children
  const keepAlive = children.find(child => {
    return (
      child.type === 'VElement' &&
      child.name === 'keep-alive' &&
      child.children.length
    )
  })
  if (keepAlive) {
    routerView = (<VElement>keepAlive).children.find(child => {
      return child.type === 'VElement' && child.name === 'router-view'
    })
  } else {
    routerView = (<VElement>node).children.find(child => {
      return child.type === 'VElement' && child.name === 'router-view'
    })
  }

  // replace with vue-router-next syntax
  if (routerView) {
    routerView = <VElement>routerView
    // get attributes text
    let attributeText = routerView.startTag.attributes
      .map(attr => OperationUtils.getText(attr, source))
      .join(' ')
    // replace with vue-router-next syntax
    fixOperations.push(
      OperationUtils.replaceText(routerView, '<component :is="Component" />')
    )
    fixOperations.push(
      OperationUtils.insertTextBefore(
        node,
        `<router-view ${attributeText} v-slot="{ Component }">`
      )
    )
    fixOperations.push(OperationUtils.insertTextAfter(node, '</router-view>'))
  }

  return fixOperations
}
