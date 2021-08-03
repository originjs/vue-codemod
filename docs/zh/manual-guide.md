- [手动迁移指导](#手动迁移指导)
  - [限制](#限制)
    - [Vue 版本](#vue-版本)
    - [第三方依赖](#第三方依赖)
  - [Vue](#vue)
    - [全局 API](#全局-api)
    - [插槽](#插槽)
    - [过滤器](#过滤器)
      - [局部 filter](#局部-filter)
      - [全局 filter](#全局-filter)
    - [事件 API](#事件-api)
    - [/deep/样式](#deep样式)
    - [分隔符](#分隔符)
  - [Vue Router](#vue-router)
    - [VueRouter.prototype](#vuerouterprototype)
    - [path 中的通配符 *](#path-中的通配符-)
    - [Router 4 所有的导航都是异步的](#router-4-所有的导航都是异步的)
  - [Element-ui](#element-ui)
    - [升级依赖](#升级依赖)
    - [依赖替换](#依赖替换)
    - [表格 el-table 作用域插槽](#表格-el-table-作用域插槽)

<!-- /TOC -->

# 手动迁移指导

手动迁移之前，请先使用 [vue-codemod](https://github.com/originjs/vue-codemod) 工具进行自动转换。工具使用方法请参考 [使用指导](./使用指导.md) 。

本迁移手册是基于已经转换的项目中的实际遇到的问题进行总结的，在更多真实项目的转换过程中，可能会遇到其他问题，欢迎提交 [issue](https://github.com/originjs/vue-codemod/issues) 或者 [PR](https://github.com/originjs/vue-codemod/pulls) 进行贡献。

## 限制

### Vue 版本

Vue 的版本需要不低于 **2.6.0**，如果使用了 2.6.0 之前的版本，可能部分语法无法自动转换。

### 第三方依赖

dependency 中有不支持 Vue 3 的库，暂时无法实现升级，需要选择其他依赖库替代，并重写部分逻辑。

目前已经支持 Vue 3 的 UI 框架库有：

- [quasar](https://github.com/quasarframework/quasar)
- [element-plus](https://github.com/element-plus/element-plus/)
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue)

具体是否支持 Vue 3 ，可参考 [Vue2ToVue3](https://github.com/zdravkov/Vue2ToVue3)

## Vue

### 全局 API

 [官方迁移指导](https://v3.cn.vuejs.org/guide/migration/global-api.html)

- 使用**插件**的方式对`全局 API` 进行转换

  - 将非 main.js 中的全局 API 装载为插件形式

    Vue 2 中：

    ```js
    // directive/index.js
    import Vue from "vue";
    import myDirective from "@/directive/myDirective";

    Vue.directive('myDirective', myDirective) ;
    ```

    Vue 3 中：

    ```js
    // directive/index.js
    import myDirective from "@/directive/myDirective";

    export default{
        install: app => {
            app.directive('myDirective', myDirective) ;
        }
    }
    ```

  - 并在 main.js 中引用使用该插件

    ```js
    // main.js
    import MyDirective from '@/directive'
  
    Vue.createApp(App).use( myDirective)
    ```

- 使用 `window.app=app` 的方式对`全局配置`进行转换

  - main.js 中配置`全局 app` 实例

    ```js
    // main.js
    const app = Vue.createApp(App)
    window.app = app  // 配置全局 app 实例
    app.mount('#app')
    ```

  - 非 main.js 中的配置

    Vue 2 中:

    ```js
    // message/index.js
    Vue.prototype.$baseMessage = () => {
      Message({
        offset: 60,
        showClose: true
      })
    }
    ```

    Vue 3 中：

    ```js
    // message/index.js
    app.config.globalProperties.$baseMessage = () => {
      Message({
        offset: 60,
        showClose: true
      })
    }
    ```

    注意：使用 `window.app` 需要结合 Vue 框架中 js 代码的执行顺序，只有在 main.js 中 `window.app = app` 配置语句之后运行的代码才可以使用 `window.app`。已知在 main.js 之后运行的代码部分为：(1) 在 Vue 组件的 `export default {}` 中运行；(2) 在 main.js 使用 `app.use()` 的 js 文件。

### 插槽

详情见：[官方迁移指导](https://cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)

`slot` 属性的语法在 Vue 2.6.0 版本开始被废弃了，需要使用 `v-slot` 指令来支持具名插槽。转换工具的 `slot-attribute` 规则会将 `slot` 属性转换为 `v-slot` 指令的用法：

```vue
<base-layout>
  <p slot="content">2.5 slot attribute in slot</p>
</base-layout>
```

会被转换为：

```vue
<base-layout>
  <template v-slot:content>
    <p >2.5 slot attribute in slot</p>
  </template>
</base-layout>
```

对于同时使用了 `v-if` 与 `v-else` 指定的具名插槽来说，工具的转换则会产生错误：

```vue
<el-button v-if="showCronBox" slot="append" @click="showBox = false"></el-button>
<el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
```

将会被转换为：

```vue
<template v-slot:append>
  <el-button v-if="showCronBox" @click="showBox = false"></el-button>
</template>
<template v-slot:append>
  <el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
</template>
```

由于 `v-if` 与 `v-else` 被分隔到两个 `<template>` 中，将会编译报错找不到 `v-if`，需要将 `v-if` 与 `v-else` 放到同一个 `<template>` 标签范围内：

```vue
<template v-slot:append> 
  <el-button v-if="showCronBox" @click="showBox = false"></el-button>
  <el-button v-else="showCronBox" slot="append" @click="showBox = true"></el-button>
</template>
```

### 过滤器

#### 局部 filter

详情见[官方迁移指导](https://v3.cn.vuejs.org/guide/migration/filters.html)

#### 全局 filter

详情见[官方迁移指导](https://v3.cn.vuejs.org/guide/migration/filters.html#全局过滤器)

### 事件 API

在 Vue 3 中，`$on`，`$off`，`$once` 实例方法已经被移除，应用实例不再实现事件触发接口，因此无法使用这些 API 从组件内部监听组件自己发出的事件。但是该 `eventHub` 模式可以被替换为实现了事件触发器接口的外部库。

详情见[官方迁移指导](https://v3.cn.vuejs.org/guide/migration/events-api.html)

- 添加 `mitt` 依赖
  
  ```bash
  yarn add mitt
  // or
  npm install mitt
  ```

- 创建 `mitt` 实例

  ```js
  import mitt from 'mitt'

  const bus = {}
  const emitter = mitt()
  bus.$on = emitter.on
  bus.$off = emitter.off
  bus.$once = emitter.once

  export default bus
  ```

- main.js 中添加全局事件总线声明

  ```js
  // main.js
  import bus from '@/bus'
  
  const app = createApp(App).mount('#app')
  app.config.globalProperties.$bus = bus
  ```

### /deep/样式

- `>>>` 和 `/deep/` 已经不支持了
- `/deep/ .el-input {}` 更改为 `:deep(.el-input) {}` 
- `v-deep:: .bar {}` 更改为 `::v-deep(.bar) {}`

### 分隔符

Vue 2 中事件内部语句可以通过`换行符`作为分隔符：

```vue
<button @click="
  item.value = ''
  clearTag()
">
</button>
```

但是在 Vue 3 中，需要添加 `;` 或者 `,` 作为分隔符：

```vue
<button @click="
  item.value = '';
  clearTag()
">
</button>
```

## Vue Router

### VueRouter.prototype

> 详情见：[官方迁移指导](https://next.router.vuejs.org/zh/guide/migration/index.html#new-router-变成-createrouter)

Router 3 中，Vue Router 是一个类，可以通过 `prototype` 访问 `push` 方法，但是在 Router 4 中，Router 是一个实例，需要通过实例去访问 `push` 方法。

在 Router 3（配套 Vue 2）中：

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

在 Router 4（配套 Vue 3）中

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 注意：重写 push 方法要在创建 router 实例之后
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

### path 中的通配符 *

> 详情见：[官方迁移指导](https://next.router.vuejs.org/zh/guide/migration/index.html#删除了-（星标或通配符）路由)

现在必须使用指定的 `regex` 参数来定义所有路由(`*`、`/*`)。

在 Router 3（配套 Vue 2）中，可以直接定义 `*` 路由：

```js
// router/index.js
const asyncRoutes = [
  {
    path: '*',
    redirect: '/'
  }
]
```

在 Router 4（配套 Vue 3）中，则需要使用 `pathMatch` 来定义 path：

```js
// router/index.js
const asyncRoutes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
```

### Router 4 所有的导航都是异步的

可能会导致部分组件渲染失败，例如下面的 `RuleFilter.vue` 组件：

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

其中 `this.$bus.$emit` 将会激发事件失败，因为事件还不存在，事件在组件挂载之后才会注册到 `$bus` 上：

```js
// RuleFilterTbl.vue
mounted() {
  this.$bus.$on('filterSearch', this.search)
  this.$bus.$on('filterReset', this.reset)
}
```

所以触发 `filterSearch` 事件时需要等待组件挂载，修改为：

```js
watch: {
  $route: {
    immediate: true,
    handler (to, from) {
      if (to.name === 'RuleFilterTbl') {
        const param = !!this.$refs.internal ? this.$refs.internal.selectItem : {}
        // 判断路由是否完成初始化
        this.$router.isReady().then(() => {
          this.$bus.$emit('filterSearch', param)
        })
      }
   
    }
  }
}
```

## Element-ui

目前 [Element UI](https://github.com/ElemeFE/element) 提供了适配 Vue 3 的组件库 [Element Plus](https://github.com/element-plus/element-plus)，涉及 `Element` 的部分需要手动升级。

### 升级依赖

```bash
npm install element-plus
npm remove element-ui
```

### 依赖替换

> 转换规则开发中

- import 中的 `source` 改变了，可以通过 IDE 进行全局替换：`import xx from 'element-ui'` -> `import xx from 'element-plus'`
- 部分组件名改变了，需要逐个手动识别：`import { Message } from 'element-ui'` -> `import { ElMessage } from 'element-plus'`

### 表格 el-table 作用域插槽

必须使用 `<template>` 配合 slot 的形式，例如：

```vue
<el-table>
  <span slot-scope='scope'>{{ scope.row.num }}</span>
</el-table>
```

需要切换成：

```vue
<el-table>
  <template #default='scope'>
    <span>{{ scope.row.num }}</span>
  </template>
</el-table>
```
