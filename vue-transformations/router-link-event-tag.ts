import { Node, VElement } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

export const transformAST = createTransformAST(
  nodeFilter,
  fix,
  'router-link-event-tag'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  // filter for router-link node
  return node.type === 'VElement' && node.name === 'router-link'
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
