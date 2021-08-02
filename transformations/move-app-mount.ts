import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = ({ root, j }) => {
  const cntFunc = getCntFunc('move-app-mount', global.outputReport)

  const appMount = root.find(j.ExpressionStatement, {
    expression: {
      callee: {
        object: {
          name: 'app'
        },
        property: {
          name: 'mount'
        }
      }
    }
  })
  if (appMount.length !== 1) {
    return
  }
  const appMountOnly = appMount.get()
  let lastend = appMountOnly.value.end
  let appMountEnd = appMountOnly.value.end
  let lastNode = appMountOnly
  const context = appMountOnly.value.expression?.arguments[0].value
  root.find(j.ExpressionStatement).forEach(node => {
    if (
      j(node).find(j.Identifier, {
        name: 'app'
      }).length > 0
    ) {
      // @ts-ignore
      const end = node.value.end
      if (end < appMountEnd) {
        appMount.insertBefore(node.value)
        j(node).remove()
      }
      if (end > lastend) {
        lastend = end
        lastNode = node
      }
    }
  })
  if (lastend !== appMountOnly.value.end) {
    appMount.remove()
    j(lastNode).insertAfter(
      j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('app'), j.identifier('mount')),
          [j.stringLiteral(context)]
        )
      )
    )
  }
  cntFunc()
}

export default wrap(transformAST)
export const parser = 'babylon'
