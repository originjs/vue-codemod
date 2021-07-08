import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import type { VueASTTransformation } from '../src/wrapVueTransformation'
import * as parser from 'vue-eslint-parser'
import wrap from '../src/wrapVueTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: VueASTTransformation = context => {
  const cntFunc = getCntFunc('slot-attribute')
  let fixOperations: Operation[] = []
  const toFixNodes: Node[] = findNodes(context)
  toFixNodes.forEach(node => {
    const operations = fix(node)
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
      if (node.type === 'VAttribute' && node.key.name === 'slot') {
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
