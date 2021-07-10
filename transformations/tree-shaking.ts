import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { transformAST as nextTick } from './next-tick'
import { transformAST as observable } from './observable'
import { transformAST as version } from './version'
import { transformAST as removeImport } from './remove-extraneous-import'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = context => {
  const beforeCount = Object.keys(subRules).reduce(
    (sum, key) => sum + subRules[key],
    0
  )
  nextTick(context)
  observable(context)
  version(context)
  // remove import 'Vue' from 'vue' if not used
  removeImport(context, { localBinding: 'Vue' })
  const afterCount = Object.keys(subRules).reduce(
    (sum, key) => sum + subRules[key],
    0
  )
  const change = afterCount - beforeCount
  const cntFunc = getCntFunc('tree-shaking', global.outputReport)
  cntFunc(change)
}

export default wrap(transformAST)
export const parser = 'babylon'
