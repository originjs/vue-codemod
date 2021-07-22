import { Node, VAttribute } from 'vue-eslint-parser/ast/nodes'
import * as OperationUtil from '../../src/operationUtils'
import type { Operation } from '../../src/operationUtils'
import {
  default as wrap,
  createTransformAST
} from '../../src/wrapVueTransformation'

export const transformAST = createTransformAST(
  nodeFilter,
  fix,
  'time-picker-format-attribute'
)
export default wrap(transformAST)

function nodeFilter(node: Node): boolean {
  const pre = (item: VAttribute) =>
    // @ts-ignore
    item.key.name === 'bind' && item.key.argument?.name === 'format'
  return (
    node.type === 'VAttribute' &&
    node.key.type === 'VDirectiveKey' &&
    node.key.name?.name === 'bind' &&
    // @ts-ignore
    node.key.argument?.name === 'picker-options' &&
    node.value?.type === 'VExpressionContainer' &&
    node.value.expression?.type === 'ObjectExpression' &&
    // @ts-ignore
    node.value.expression.properties?.filter(item => item.key.name === 'format')
      .length > 0 &&
    node.parent?.parent.type === 'VElement' &&
    node.parent.parent?.name === 'el-time-picker' &&
    node.parent.attributes?.filter(pre).length === 0
  )
}

function fix(node: VAttribute): Operation[] {
  let fixOperations: Operation[] = []
  //  get format attribute in the time-picker
  // @ts-ignore
  let formatValue = node.value.expression.properties.filter(
    // @ts-ignore
    item => item.key.name === 'format'
  )[0].value.value
  //  add format attribute to el-time-picker tag
  fixOperations.push(
    OperationUtil.insertTextBefore(node, `format='${formatValue}' `)
  )
  return fixOperations
}
