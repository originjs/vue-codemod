- [Manual Migration Guide](#Manual-Migration-Guide)
  - [Limitation](#Limitation)
    - [Vue version](#Vue-version)
    - [Third-party dependencies](#Third-party-dependencies)
  - [Vue](#vue)
    - [Global API](#Global-API)
    - [Slot](#Slot)
    - [Filter](#Filter)
      - [Partial Filter](#Partial-Filter)
      - [Global Filter](#Global-Filter)
    - [Events API](#Events-api)
    - [/deep/](#deep)
    - [Delimiter](#Delimiter)
  - [Vue Router](#vue-router)
    - [VueRouter.prototype](#vuerouterprototype)
    - [Removed `*` routes](#Removed-`*`-routes)
    - [All navigations in Router 4 are asynchronous](#All-navigations-in-Router-4-are-asynchronous)
  - [Element-ui](#element-ui)
    - [Upgrade Dependencies](#Upgrade-Dependencies)
    - [Import Modules](#Import-Modules)
    - [`slot` attribute in el-table](#`slot`-attribute-in-el-table)

<!-- /TOC -->

# Manual Migration Guide

Before manual migration, please make sure your project has been auto upgraded by [vue-codemod](https://github.com/originjs/vue-codemod). Please refer to the [User Guide](./使用指导.md) for using `vue-codemod`.

This manual migration guide is based on the actual problems encountered in the transformed project. Users could also encounter other problems in transforming their projects. It's welcomed for users to open an [issue](https://github.com/originjs/vue-codemod/issues) or [PR](https://github.com/originjs/vue-codemod/pulls).

## Limitation

### Vue version

Vue version >= 2.6.0

### Third-party dependencies

Some third-party packages currently don't have support for Vue 3

Currently, the UI framework libraries that support Vue 3 are: 

- [quasar](https://github.com/quasarframework/quasar)
- [element-plus](https://github.com/element-plus/element-plus/)
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue)

Please refer to [Vue2ToVue3](https://github.com/zdravkov/Vue2ToVue3) to see the latest list of all the Vue3-supported UI Components and libraries.

## Vue

### Global API

 [Migration Guide from Vue.js team](https://v3.vuejs.org/guide/migration/global-api.html)

- Transform `Global API` to a plugin

  - For those global api not in `main.js`, transform them to a plugin form.

    In Vue 2:

    ```js
    // directive/index.js
    import Vue from "vue";
    import myDirective from "@/directive/myDirective";

    Vue.directive('myDirective', myDirective) ;
    ```

    In Vue 3:

    ```js
    // directive/index.js
    import myDirective from "@/directive/myDirective";

    export default{
        install: app => {
            app.directive('myDirective', myDirective) ;
        }
    }
    ```

  - Import this plugin in `main.js`

    ```js
    // main.js
    import MyDirective from '@/directive'
    
    Vue.createApp(App).use(myDirective)
    ```

- Transform `Global Configuration` by  `window.app=app` 

  - Configure the global app instance in `main.js` 

    ```js
    // main.js
    const app = Vue.createApp(App)
    window.app = app  // Configure the global app instance
    app.mount('#app')
    ```

  - Configuration not in `main.js`

    In Vue 2:

    ```js
    // message/index.js
    Vue.prototype.$baseMessage = () => {
      Message({
        offset: 60,
        showClose: true
      })
    }
    ```

    In Vue 3:

    ```js
    // message/index.js
    app.config.globalProperties.$baseMessage = () => {
      Message({
        offset: 60,
        showClose: true
      })
    }
    ```

    ⚠Attention: Users need to consider the execution order of the js code. Only the code that runs after the `window.app = app` configuration statement in `main.js` can use `window.app`. The part of the code that is known to run after main.js are: 1. run inside the `export default {}`; 2. js files that use `app.use()` in `main.js`.

### Slot

Please refer to [Migration Guide from Vue.js team](https://vuejs.org/v2/guide/components-slots.html#Deprecated-Syntax) for more details.

`slot` attributes are deprecated since Vue 2.6.0. `v-slot` was introduced for named  and scoped slots. In `vue-codemod` , the `slot-attribute` rule can transform `slot` attributes to  `v-slot` syntax：	

```vue
<base-layout>
  <p slot="content">2.5 slot attribute in slot</p>
</base-layout>
```

will be transformed to: 

```vue
<base-layout>
  <template v-slot:content>
    <p >2.5 slot attribute in slot</p>
  </template>
</base-layout>
```

For those named slots that use `v-if` and `v-else` together, `vue-codemod` will return an error.

```vue
<el-button v-if="showCronBox" slot="append" @click="showBox = false"></el-button>
<el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
```

will be transformed to: 

```vue
<template v-slot:append>
  <el-button v-if="showCronBox" @click="showBox = false"></el-button>
</template>
<template v-slot:append>
  <el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
</template>
```

Since `v-if` and `v-else` will be divided into two `<template>`, it will return an error: 

```powershell
v-else used on element <el-button> without corresponding v-if.
```

We need to manually put `v-if` and `v-else` into one `<template>` tag.

```vue
<template v-slot:append> 
  <el-button v-if="showCronBox" @click="showBox = false"></el-button>
  <el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
</template>
```

### Filter

#### Partial Filter

Please refer to [Migration Guide from Vue.js team](https://v3.vuejs.org/guide/migration/filters.html) for more details.

#### Global Filter

Please refer to [Migration Guide from Vue.js team](https://v3.vuejs.org/guide/migration/filters.html#global-filters) for more details.

### Events API

In Vue 3, `$on`, `$off` and `$once` instance methods are removed. Component instances no longer implement the event emitter interface, thus it is no longer possible to use these APIs to listen to a component's own emitted events from within a component. The event bus pattern can be replaced by using an external library implementing the event emitter interface, for example [mitt](https://github.com/developit/mitt) or [tiny-emitter](https://github.com/scottcorgan/tiny-emitter).

Please refer to [Migration Guide from Vue.js team](https://v3.vuejs.org/guide/migration/events-api.html) for more details.

- Add  `mitt` dependencies
  
  ```bash
  yarn add mitt
  // or
  npm install mitt
  ```

- Create `mitt` instance

  ```js
  import mitt from 'mitt'

  const bus = {}
  const emitter = mitt()
  bus.$on = emitter.on
  bus.$off = emitter.off
  bus.$once = emitter.once

  export default bus
  ```

- Add global event bus declaration in `main.js`

  ```js
  // main.js
  import bus from '@/bus'
  
  const app = createApp(App).mount('#app')
  app.config.globalProperties.$bus = bus
  ```

### /deep/

- `>>>` and `/deep/` are not supported
- `/deep/ .el-input {}` should be transformed to `:deep(.el-input) {}` 
- `v-deep:: .bar {}` should be transformed to `::v-deep(.bar) {}`

### Delimiter

In Vue 2, event internal statement can use `newline character` as the delimiter.

```vue
<button @click="
  item.value = ''
  clearTag()
">
</button>
```

But in Vue 3, `newline character` is no longer used as the delimiter. A `;` or `,` is needed.

```vue
<button @click="
  item.value = '';
  clearTag()
">
</button>
```

## Vue Router

### VueRouter.prototype

> Please refer to [Migration Guide from Vue.js team](https://next.router.vuejs.org/guide/migration/index.html#new-router-becomes-createrouter) for more details.

In Router 3, Vue Router is a class, which can use `prototype` to access `push` method. But in Router 4, Router is an instance, which needs to access the `push` method through an instance.

In Router 3 (for Vue 2) :

```js
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return original.call(this, location).catch(e => {
    if (e.name !== 'NavigationDuplicated') {
      return Promise.reject(e)
    }
  })
}
```

In Router 4 (for Vue 3):

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// Attention: Rewrite the push method after creating the router instance.
const originalPush = router.push
router.push = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return original.call(this, location).catch(e => {
    if (e.name !== 'NavigationDuplicated') {
      return Promise.reject(e)
    }
  })
}
```

### Removed `*` routes

> Please refer to [Migration Guide from Vue.js team](https://next.router.vuejs.org/guide/migration/index.html#removed-star-or-catch-all-routes) for more details.

Catch all routes (`*`, `/*`) must now be defined using a parameter with a custom regex.

In Router 3 (for Vue 2), users can define `*` router directly:

```js
// router/index.js
const asyncRoutes = [
  {
    path: '*',
    redirect: '/'
  }
]
```

In Router 4 (for Vue 4), users need to use `pathMatch` to define path:

```js
// router/index.js
const asyncRoutes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
```

### All navigations in Router 4 are asynchronous

It may caused some render failure for components. For example, the following `RuleFilter.vue` component: 

```js
watch: {
  $route: {
    immediate: true,
    handler (to, from) {
      if (to.name === 'RuleFilterTbl') {
        const param = !!this.$refs.internal ? this.$refs.internal.selectItem : {}
        this.$bus.$emit('filterSearch', param)
      }
    }
  }
}
```

`this.$bus.$emit` will return an error, because the event has not been created. The event will not be registered on `$bus` until the component is mounted.

```js
// RuleFilterTbl.vue
mounted() {
  this.$bus.$on('filterSearch', this.search)
  this.$bus.$on('filterReset', this.reset)
}
```

So you may need to wait for the router to be *ready* before trigger `filterSearch`:

```js
watch: {
  $route: {
    immediate: true,
    handler (to, from) {
      if (to.name === 'RuleFilterTbl') {
        const param = !!this.$refs.internal ? this.$refs.internal.selectItem : {}
        // Determine whether the router is initialized
        this.$router.isReady().then(() => {
          this.$bus.$emit('filterSearch', param)
        })
      }
   
    }
  }
}
```

## Element-ui

Currently, [Element UI](https://github.com/ElemeFE/element) provides a Vue3-supported libraries [Element Plus](https://github.com/element-plus/element-plus). The code related to `Element` needs to upgrade manuallly.

### Upgrade dependencies

```bash
npm install element-plus
npm remove element-ui
```

### Import modules

> We are developing auto transformation for element-ui import.

- The import source has changed. Users can replace it globally in IDE: `import xx from 'element-ui'` -> `import xx from 'element-plus'`
- Some components' name has changed. Users need to upgrade manually: `import { Message } from 'element-ui'` -> `import { ElMessage } from 'element-plus'`

### `slot` attribute in el-table

Must use `<template>` to wrap the `slot`. For example: 

```vue
<el-table>
  <span slot-scope='scope'>{{ scope.row.num }}</span>
</el-table>
```

Need to be transformed to:

```vue
<el-table>
  <template #default='scope'>
    <span>{{ scope.row.num }}</span>
  </template>
</el-table>
```
