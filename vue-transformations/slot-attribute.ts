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
  'slot-attribute'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  // filter for slot attribute node
  return node.type === 'VAttribute' && node.key.name === 'slot'
}

/**
 * fix logic
 * @param node
 */
function fix(node: Node): Operation[] {
  let fixOperations: Operation[] = []
  const element: any = node!.parent!.parent
  // @ts-ignore
  const slotValue: string = node!.value!.value

  if (
    element != null &&
    element != undefined &&
    element.type == 'VElement' &&
    element.name == 'template'
  ) {
    // template element replace slot="xxx" to v-slot:xxx
    fixOperations.push(OperationUtils.replaceText(node, `v-slot:${slotValue}`))
  } else {
    // remove v-slot:${slotValue}
    fixOperations.push(OperationUtils.remove(node))
    // add <template v-slot:${slotValue}>

    let elder: any = null
    let hasSlotAttr: boolean = false
    let tmp: any = element
    // find template parent
    while (elder == null && tmp != null) {
      hasSlotAttr = false
      tmp = tmp.parent
      if (tmp == null || tmp.type != 'VElement' || tmp.name != 'template') {
        continue
      }

      elder = element
      tmp.startTag.attributes
        .filter(
          (attr: any) =>
            attr.type === 'VAttribute' &&
            attr.key.type === 'VIdentifier' &&
            attr.key.name === 'slot'
        )
        .forEach((element: any) => {
          hasSlotAttr = true
        })
      if (hasSlotAttr) {
        break
      }
    }

    if (!hasSlotAttr) {
      fixOperations.push(
        OperationUtils.insertTextBefore(
          element,
          `<template v-slot:${slotValue}>`
        )
      )
      // add </template>
      fixOperations.push(OperationUtils.insertTextAfter(element, `</template>`))
    }
  }

  return fixOperations
}
