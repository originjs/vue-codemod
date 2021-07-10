import { Node } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtils from '../src/operationUtils'
import type { Operation } from '../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../src/wrapVueTransformation'

export const transformAST = createTransformAST(nodeFilter, fix, 'slot-default')

export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  return (
    node.type === 'VAttribute' &&
    node.key.type === 'VDirectiveKey' &&
    node.key.name.name === 'slot' &&
    node.key.argument?.type === 'VIdentifier' &&
    node.key.argument?.name === 'default' &&
    node.parent.parent.type == 'VElement' &&
    node.parent.parent.name == 'template'
  )
}

function fix(node: Node): Operation[] {
  let fixOperations: Operation[] = []

  const target: any = node!.parent!.parent
  const targetParent: any = target.parent

  targetParent.children
    .filter((el: any) => el.type == 'VElement' && el.name != 'template')
    .forEach((element: any) => {
      fixOperations.push(OperationUtils.remove(element))
    })
  return fixOperations
}
