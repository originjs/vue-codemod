import wrap from '../../src/wrapAstTransformation'
import type { ASTTransformation } from '../../src/wrapAstTransformation'

// router.onReady(succes,err) => router.isReady().then(succes).catch(error)
export const transformAST: ASTTransformation = ({ j, root }) => {
  // find onReady
  const readyExpresstion = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: 'router' || 'route'
      },
      property: {
        type: 'Identifier',
        name: 'onReady'
      }
    }
  })
  // .filter(node => node.callee.object.name === 'router')
  if (!readyExpresstion.length) return

  readyExpresstion.replaceWith(({ node }) => {
    const express = node.callee
    const params = node.arguments
    //@ts-ignore
    express.property.name = 'isReady'
    const successFn = j.callExpression(
      j.memberExpression(j.callExpression(express, []), j.identifier('then')),
      [params[0]]
    )

    if (params.length == 1) {
      return successFn
    }

    return j.callExpression(
      j.memberExpression(successFn, j.identifier('catch')),
      [params[1]]
    )
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
