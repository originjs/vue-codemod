import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'
import { getCntFunc } from '../../src/report'

// addRoute() addRoutes()-> forEach addRoute
export const transformAST: ASTTransformation = context => {
  const { root, j } = context
  const cntFunc = getCntFunc('router-update-addRoute', global.outputReport)
  const addRouteExpression = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: {
        type: 'Identifier',
        name: 'addRoute'
      }
    }
  })

  if (addRouteExpression.length) {
    addRouteExpression.replaceWith(({ node }) => {
      // Multiple parameters are not supported
      const routerArgs: any = node.arguments[0]
      const routerCallee: any = node.callee

      if (
        !(
          routerCallee.object.name === 'router' ||
          routerCallee.object.name === 'route'
        )
      ) {
        return node
      }

      const arrowFun = root.find(j.ArrowFunctionExpression, {
        params: [
          {
            type: 'Identifier',
            name: routerArgs.name
          }
        ],
        body: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            property: {
              type: 'Identifier',
              name: 'addRoute'
            }
          }
        }
      })

      if (arrowFun.length) {
        return node
      }
      cntFunc()
      return j.callExpression(
        j.memberExpression(routerArgs, j.identifier('forEach')),
        [
          j.arrowFunctionExpression(
            [j.identifier('item')],
            j.callExpression(routerCallee, [j.identifier('item')])
          )
        ]
      )
    })
  }

  const addRoutesExpression = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: {
        type: 'Identifier',
        name: 'addRoutes'
      }
    }
  })

  addRoutesExpression.replaceWith(({ node }) => {
    const routerArgs: any = node.arguments[0]
    const routerCallee: any = node.callee
    if (
      !(
        routerCallee.object.name === 'router' ||
        routerCallee.object.name === 'route'
      )
    ) {
      return node
    }
    if (routerCallee.property.name === 'addRoutes') {
      routerCallee.property.name = 'addRoute'
    }

    return j.callExpression(
      j.memberExpression(routerArgs, j.identifier('forEach')),
      [
        j.arrowFunctionExpression(
          [j.identifier('item')],
          j.callExpression(routerCallee, [j.identifier('item')])
        )
      ]
    )
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
