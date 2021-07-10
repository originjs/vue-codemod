import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { transformAST as removeExtraneousImport } from './remove-extraneous-import'
import type { GlobalApi } from '../src/global'
import * as _ from 'lodash'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context
  const cntFunc = getCntFunc('new-component-api', global.outputReport)
  const rootExpressionStatement = root
    .find(j.ExpressionStatement)
    .filter(path => path.parent.value.type === 'Program')
  if (rootExpressionStatement.length > 1) {
    return
  }
  // find Vue.component
  const componentRegistration = root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          name: 'Vue'
        },
        property: {
          name: 'component'
        }
      }
    })
    .filter(path => {
      return path.parent.parent.value.type === 'Program'
    })

  let componentArgs: any[] = []
  componentRegistration.forEach(({ node }) => {
    if (node.arguments.length === 2) {
      componentArgs = node.arguments
      let componentApi: GlobalApi
      cntFunc()
      if (j.Identifier.check(componentArgs[1])) {
        componentApi = { name: componentArgs[1].name, path: filename }
      } else {
        componentApi = {
          name: _.upperFirst(_.camelCase(componentArgs[0].value)),
          path: filename
        }
      }
      global.globalApi.push(componentApi)
    }
  })

  // app.component()
  const componentCall = j.callExpression(
    j.memberExpression(j.identifier('app'), j.identifier('component')),
    componentArgs
  )
  // app => { app.component() }
  const installArrowFunction = j.arrowFunctionExpression(
    [j.identifier('app')],
    j.blockStatement([j.expressionStatement(componentCall)])
  )

  // { install: app => {app.component() } }
  const objectExpression = j.objectExpression([
    j.objectProperty(j.identifier('install'), installArrowFunction)
  ])

  // export default {}
  const exportDefaultDeclaration = j.exportDefaultDeclaration(objectExpression)

  componentRegistration.replaceWith(() => exportDefaultDeclaration)

  removeExtraneousImport(context, { localBinding: 'Vue' })
}

export default wrap(transformAST)
export const parser = 'babylon'
