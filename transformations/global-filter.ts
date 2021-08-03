import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = ({ root, j }) => {
  const cntFunc = getCntFunc('global-filter', global.outputReport)
  // find the createApp()
  const constApp = root.find(j.VariableDeclarator, {
    id: {
      name: 'app'
    }
  })
  if (constApp.length <= 0) {
    return
  }
  const vueCreateApp = j(constApp?.at(0).get().value.init).find(
    j.MemberExpression,
    {
      object: {
        name: 'Vue'
      },
      property: {
        name: 'createApp'
      }
    }
  )

  if (!constApp.length || !vueCreateApp.length) {
    return
  }
  const appName = constApp.at(0).get().value.id.name

  // Vue.filter('filterName', function(value) {}) =>
  // app.config.globalProperties.$filters = { filterName(value) {} }
  const filters = root.find(j.ExpressionStatement, {
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'Vue' },
        property: { type: 'Identifier', name: 'filter' }
      }
    }
  })
  if (!filters.length) {
    return
  }

  cntFunc()
  const methods = []
  for (let i = 0; i < filters.length; i++) {
    const filter = filters.at(i)
    const args = filter.get().node.expression.arguments

    methods.push(
      j.objectMethod(
        'method',
        j.identifier(args[0].value),
        args[1].params,
        args[1].body
      )
    )
  }

  filters
    .at(0)
    .insertBefore(
      j.expressionStatement(
        j.assignmentExpression(
          '=',
          j.memberExpression(
            j.identifier(appName),
            j.identifier('config.globalProperties.$filters'),
            false
          ),
          j.objectExpression(methods)
        )
      )
    )

  for (let i = 0; i < filters.length; i++) {
    filters.at(i).remove()
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
