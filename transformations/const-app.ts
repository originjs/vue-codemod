import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { getCntFunc } from '../src/report'

export const transformAST: ASTTransformation = ({ root, j }) => {
  const cntFunc = getCntFunc('const-app', global.outputReport)

  // Determine if there is a .mount()
  const createAppParent = root.find(j.ExpressionStatement, {
    expression: {
      callee: {
        property: {
          name: 'mount'
        }
      }
    }
  })
  if (createAppParent.length != 1) {
    return
  }

  // replace Vue.component and Vue.directive
  root
    .find(j.MemberExpression, {
      object: {
        name: 'Vue'
      }
    })
    .filter(
      node =>
        // @ts-ignore
        node.value.property.name === 'directive' ||
        // @ts-ignore
        node.value.property.name === 'component'
    )
    .forEach(node => {
      // @ts-ignore
      node.value.object.name = 'app'
    })

  // Determine if there is a app.mount('#app')
  const ifConstApp = root.find(j.MemberExpression, {
    object: {
      name: 'app'
    },
    property: {
      name: 'mount'
    }
  })
  if (ifConstApp.length > 0) {
    return
  }

  let newCreateApp
  let mountContext
  createAppParent.forEach(node => {
    const createApp = node.value.expression

    // get the value in the .mount()
    // @ts-ignore
    mountContext = createApp.arguments[0].value

    // get the expression without .mount('#app')
    // @ts-ignore
    newCreateApp = createApp.callee.object
  })

  createAppParent.replaceWith(
    j.variableDeclaration('const', [
      j.variableDeclarator(j.identifier('app'), newCreateApp)
    ])
  )

  createAppParent.insertAfter(
    j.expressionStatement(
      j.callExpression(
        j.memberExpression(j.identifier('app'), j.identifier('mount')),
        // @ts-ignore
        [j.stringLiteral(mountContext)]
      )
    )
  )

  cntFunc()
}

export default wrap(transformAST)
export const parser = 'babylon'
