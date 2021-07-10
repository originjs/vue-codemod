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
  'v-for-v-if-precedence-changed'
)

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.directive &&
    node.key.name.name === 'for' &&
    node.parent.attributes.length > 1
  )
}

function fix(node: Node, source: string): Operation[] {
  let fixOperations: Operation[] = []
  const target: any = node!.parent
  let forValue: string = source.slice(node.range[0], node.range[1])
  let keyNode: any = false
  let ifNode: boolean = false
  for (let findKeyNode of target?.attributes) {
    // @ts-ignore
    if (findKeyNode?.key?.argument?.name === 'key') {
      keyNode = findKeyNode
    }

    if (findKeyNode?.key?.name?.name === 'if') {
      ifNode = true
    }
  }

  if (ifNode) {
    if (keyNode) {
      let keyValue: string = source.slice(keyNode.range[0], keyNode.range[1])
      forValue += ' ' + keyValue
      fixOperations.push(OperationUtils.remove(keyNode))
    }
    fixOperations.push(OperationUtils.remove(node))
    fixOperations.push(
      OperationUtils.insertTextBefore(
        target!.parent,
        `<template ${forValue}>\n`
      )
    )
    fixOperations.push(
      OperationUtils.insertTextAfter(target!.parent, `\n</template>`)
    )
  }

  return fixOperations
}
