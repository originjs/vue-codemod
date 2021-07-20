import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { transformAST as elementPlusImport } from './element-plus/element-plus-import'
import { transformAST as elementPlusComponentName } from './element-plus/element-plus-component-name'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = context => {
  const beforeCount = Object.keys(subRules).reduce(
    (sum, key) => sum + subRules[key],
    0
  )
  elementPlusImport(context)
  elementPlusComponentName(context)
  const afterCount = Object.keys(subRules).reduce(
    (sum, key) => sum + subRules[key],
    0
  )
  const change = afterCount - beforeCount
  const cntFunc = getCntFunc('element-ui-upgrade', global.outputReport)
  cntFunc(change)
}

export default wrap(transformAST)
export const parser = 'babylon'
