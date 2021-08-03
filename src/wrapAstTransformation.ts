import type { JSCodeshift, Transform, Core } from 'jscodeshift'
import { cliInstance } from './report'

export type Context = {
  root: ReturnType<Core>
  j: JSCodeshift
  filename: string
}

export type ASTTransformation<Params = void> = {
  (context: Context, params: Params): void
}

global.subRules = {}

export default function astTransformationToJSCodeshiftModule<Params = any>(
  transformAST: ASTTransformation<Params>
): Transform {
  const transform: Transform = (file, api, options: Params) => {
    const j = api.jscodeshift
    let root
    try {
      root = j(file.source)
    } catch (err) {
      cliInstance.stop()
      console.error(
        `JSCodeshift failed to parse ${file.path},` +
          ` please check whether the syntax is valid`
      )
      return
    }

    transformAST({ root, j, filename: file.path }, options)

    return root.toSource({ lineTerminator: '\n' })
  }

  return transform
}
