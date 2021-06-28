import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'

// addRoute() addRoutes()-> forEach addRoute
export const transformAST: ASTTransformation = context => {
  const { root, j } = context
  const addRouteExpression = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: {
        type: 'Identifier',
        name: 'addRoute'
      }
    }
  })

  addRouteExpression.replaceWith(({ node }) => {
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

    const callState = j.callExpression(
      j.memberExpression(j.identifier('Array'), j.identifier('isArray'), false),
      [routerArgs]
    )

    const trueCall = j.callExpression(
      j.memberExpression(routerArgs, j.identifier('forEach')),
      [
        j.arrowFunctionExpression(
          [j.identifier('item')],
          j.callExpression(routerCallee, [j.identifier('item')])
        )
      ]
    )

    const trueBlock = j.blockStatement([j.expressionStatement(trueCall)])
    const falseBlock = j.blockStatement([j.expressionStatement(node)])

    return j.ifStatement(callState, trueBlock, falseBlock)
  })

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
