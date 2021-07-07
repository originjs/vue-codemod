import { Node, VElement } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import type { VueASTTransformation } from '../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../src/wrapVueTransformation'

export const transformAST: VueASTTransformation = context => {
  let fixOperations: Operation[] = []
  const toFixNodes: Node[] = findNodes(context)
  const { file } = context
  const source = file.source
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

  // get tag attribute and event attribute value
  // get other attribute text
  let tagValue, eventValue
  let attrTexts: string[] = []
  node.startTag.attributes.forEach(attr => {
    if (attr.type === 'VAttribute') {
      const name = attr.key.name
      if (name === 'tag' && attr.value?.type === 'VLiteral') {
        tagValue = attr.value.value
      } else if (name === 'event' && attr.value?.type === 'VLiteral') {
        eventValue = attr.value.value
      } else {
        attrTexts.push(OperationUtils.getText(attr, source))
      }
    }
  })
  const attrText = attrTexts.join(' ')

  if (tagValue || eventValue) {
    // convert event attribute to new syntax
    eventValue = eventValue || ['click']
    if (typeof eventValue === 'string') {
      if ((<String>eventValue).includes(',')) {
        eventValue = JSON.parse((<String>eventValue).replace(/'/g, '"'))
      } else {
        eventValue = [eventValue]
      }
    }
    const event = eventValue
      .map((value: String) => `@${value}="navigate"`)
      .join(' ')

    // get tag attribute value and router-link text
    tagValue = tagValue || 'a'
    const text = OperationUtils.getText(node.children[0], source)

    // convert to new syntax
    fixOperations.push(
      OperationUtils.replaceText(
        node.startTag,
        `<router-link ${attrText} custom v-slot="{ navigate }">`
      )
    )
    fixOperations.push(OperationUtils.remove(node.children[0]))
    fixOperations.push(
      OperationUtils.insertTextAfter(
        node.startTag,
        `<${tagValue} ${event}>${text}</${tagValue}>`
      )
    )
  }

  return fixOperations
}
