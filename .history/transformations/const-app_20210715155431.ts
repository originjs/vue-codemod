import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'
import { getCntFunc } from '../src/report'



export const transformAST: ASTTransformation = ({ root, j }) => {
  const cntFunc = getCntFunc('const-app', global.outputReport)

  const createAppFather =root.find(j.ExpressionStatement,{
    expression:{
      callee:{
        property:{
          name:'mount'
        }
      }
    }
  })
  if (createAppFather.length!=1){
    return
  }

  var newCreateApp
  var mountContext
  createAppFather.forEach(node=>{
    const createApp=node.value.expression

    //获取mount()中的内容
    // @ts-ignore
    mountContext=createApp.arguments[0].value;

    //去除..mount('#app')
    // @ts-ignore
    newCreateApp=createApp.callee.object;

  })

  createAppFather.replaceWith(
    j.variableDeclaration('const',[j.variableDeclarator(j.identifier('app'),newCreateApp)])
  )

  // @ts-ignore
  const fuck=root.find(j.ExpressionStatement).forEach(node=>{
    console.log(node)
  })

  // var end=0;
  // const lastNode
  // const expressions=root.find(j.ExpressionStatement).forEach(node=>{
  //   if (node.end>end){
  //     end=node.end
  //   }
  // })
  // const variables=root.find(j.VariableDeclaration)


  createAppFather.insertAfter(j.expressionStatement(
    j.callExpression(
      j.memberExpression(j.identifier('app'),j.identifier('mount'))
      // @ts-ignore
      ,[j.stringLiteral(mountContext)])
  ))

  // // @ts-ignore
  console.log("root:",root.find(j.Program))

  // @ts-ignore
  const temp=root.find(j.Program)
  cntFunc()
}

export default wrap(transformAST)
export const parser = 'babylon'
