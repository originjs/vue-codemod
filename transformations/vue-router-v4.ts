import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as addImport } from './add-import'
import { transformAST as removeExtraneousImport } from './remove-extraneous-import'

import type { ObjectExpression } from 'jscodeshift'
import { getCntFunc } from '../src/report'
import { pushManualList } from '../src/report'

// new Router() -> createRouter()
export const transformAST: ASTTransformation = context => {
  const { root, j, filename } = context
  const routerImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'vue-router'
    }
  })

  // stats
  const cntFunc = getCntFunc('vue-router-v4', global.outputReport)
  const importedVueRouter = routerImportDecls.find(j.ImportDefaultSpecifier)
  if (importedVueRouter.length) {
    const localVueRouter = importedVueRouter.get(0).node.local.name
    cntFunc()
    const newVueRouter = root.find(j.NewExpression, {
      callee: {
        type: 'Identifier',
        name: localVueRouter
      }
    })

    let localCreateRouter = 'createRouter'
    // find whether createRouter has been used
    const createRouterIdentifiers = root.find(j.Identifier, {
      name: 'createRouter'
    })
    const importedCreateRouter = importedVueRouter.find(j.ImportSpecifier, {
      imported: {
        name: 'createRouter'
      }
    })
    if (!importedCreateRouter.length) {
      if (createRouterIdentifiers.length) {
        // rename createRouter to newCreateRouter
        localCreateRouter = 'newCreateRouter'
        addImport(context, {
          specifier: {
            type: 'named',
            imported: 'createRouter',
            local: localCreateRouter
          },
          source: 'vue-router'
        })
      } else {
        addImport(context, {
          specifier: { type: 'named', imported: 'createRouter' },
          source: 'vue-router'
        })
      }
    }

    // filter the node to the manual list
    let ifEnd = false
    newVueRouter.forEach(({ node }) => {
      if (
        node.arguments.length > 0 &&
        !j.ObjectExpression.check(node.arguments[0])
      ) {
        const path = filename
        const name = 'vue-router new VueRouter'
        const suggest = `Currently, only object expressions passed to \`new VueRouter\` can be transformed.`
        const website =
          'https://next.router.vuejs.org/guide/migration/index.html#new-router-becomes-createrouter'
        pushManualList(path, node, name, suggest, website)
        ifEnd = true
        return
      }
      if (node.arguments.length > 0) {
        // @ts-ignore
        const routerConfig: ObjectExpression = node.arguments[0]
        routerConfig.properties.forEach(p => {
          if (
            (j.ObjectProperty.check(p) || j.Property.check(p)) &&
            (p.key as any).name === 'mode'
          ) {
            const mode = (p.value as any).value
            if (mode !== 'hash' && mode !== 'history' && mode !== 'abstract') {
              const path = filename
              const name = 'vue-router mode'
              const suggest = `mode must be one of 'hash', 'history', or 'abstract'`
              const website =
                'https://next.router.vuejs.org/guide/migration/index.html#new-history-option-to-replace-mode'
              pushManualList(path, p, name, suggest, website)
              ifEnd = true
              return
            }
          }
        })
      }
    })
    if (ifEnd) {
      return
    }

    newVueRouter.replaceWith(({ node }) => {
      // mode: 'history' -> history: createWebHistory(), etc
      let historyMode = 'createWebHashHistory'
      let baseValue

      if (!j.ObjectExpression.check(node.arguments[0])) {
        throw new Error(
          'Currently, only object expressions passed to `new VueRouter` can be transformed.'
        )
      }

      const routerConfig: ObjectExpression = node.arguments[0]
      routerConfig.properties = routerConfig.properties.filter(p => {
        if (!j.ObjectProperty.check(p) && !j.Property.check(p)) {
          return true
        }
        if ((p.key as any).name === 'mode') {
          const mode = (p.value as any).value
          if (mode === 'hash') {
            historyMode = 'createWebHashHistory'
          } else if (mode === 'history') {
            historyMode = 'createWebHistory'
          } else if (mode === 'abstract') {
            historyMode = 'createMemoryHistory'
          } else {
            throw new Error(
              `mode must be one of 'hash', 'history', or 'abstract'`
            )
          }
          return false
        } else if ((p.key as any).name === 'base') {
          baseValue = p.value
          return false
        } else if ((p.key as any).name === 'fallback') {
          return false
        }

        return true
      })

      // add the default mode with a hash history
      addImport(context, {
        specifier: { type: 'named', imported: historyMode },
        source: 'vue-router'
      })
      node.arguments[0].properties = node.arguments[0].properties.filter(
        p => !!p
      )
      node.arguments[0].properties.unshift(
        j.objectProperty(
          j.identifier('history'),
          j.callExpression(
            j.identifier(historyMode),
            baseValue ? [baseValue] : []
          )
        )
      )
      return j.callExpression(j.identifier(localCreateRouter), node.arguments)
    })

    // VueRouter.START_LOCATION => import {START_LOCATION} from 'vue-router'
    const startLocationMember = root.find(j.MemberExpression, {
      object: {
        type: 'Identifier',
        name: localVueRouter
      },
      property: {
        type: 'Identifier',
        name: 'START_LOCATION'
      }
    })

    if (startLocationMember.length) {
      addImport(context, {
        specifier: { type: 'named', imported: 'START_LOCATION' },
        source: 'vue-router'
      })
      startLocationMember.replaceWith(({ node }) => {
        return node.property
      })
    }
    removeExtraneousImport(context, {
      localBinding: localVueRouter
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
