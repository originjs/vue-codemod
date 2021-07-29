import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

export const transformAST: ASTTransformation = ({ root, j }) => {
  const getMsg = root.find(j.VariableDeclarator, {
    id: {
      name: 'msg'
    }
  })
  // @ts-ignore
  let msg
  getMsg.forEach(node => {
    // @ts-ignore
    msg = node.value.init.value
    // @ts-ignore
    node.value.init.value = msg + '*changed'
  })
  global.buffers.push({ msg: msg })
}

export default wrap(transformAST)
export const parser = 'babylon'
