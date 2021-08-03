# 利用 vue-codemod 工具升级到 Vue 3

## 概述

Vue 3 正式版本发布已经半年有余，同时 Vue 2 会逐步停止维护，如何将现有的 Vue 2 工程迁移到 Vue 3 成为了大家关心的问题，尽管目前Vue官方有了详细的迁移指导，但实际项目中源码升级迁移工作量比较大，为减少重复性工作，这里推荐一款迁移工具 [originjs/vue-codemod](https://github.com/originjs/vue-codemod) ，该工具可以将大部分的 Vue2（推荐 Vue 2.6 以上版本）的语法直接升级成 Vue 3 语法，之后配合一些手动更改完成 Vue 2 项目的迁移。

> 说明：[originjs/vue-codemod](https://github.com/vuejs/vue-codemod) 是基于 [vuejs/vue-codemod](https://github.com/vuejs/vue-codemod) 的fork仓库，由于上游社区作者繁忙，暂时没有将我们的特性合入到原始项目中，因此我们在自己的 fork 仓库上继续特性开发。

演示项目地址：[vue2-element-touzi-admin](https://github.com/originjs/vue2-element-touzi-admin/tree/to-vue3)

## 全局安装vue-codemod

话不多说，上工具，工具安装

`npm install originjs/vue-codemod -g` or `yarn add originjs/vue-codemod -g`

## 迁移步骤

### Step1：[使用Vue codemod来改造我们的源代码](https://github.com/originjs/vue2-element-touzi-admin/commit/21aeb41bf8595a7a6323a92ed9326cec4c7f5955)

> 注意：vue-codemod 是在源路径下修改文件，若您的代码没有使用诸如 Git、SVN 等版本管理工具时，请提前备份。

运行命令：`npx vue-codemod src -a`，在手动修改前直接使用 vue-codemod 来一波自动升级（实际是语法替换），下面是转换日志，我们可以看到转换了哪些规则，更改了哪些文件；

```cmd
npx vue-codemod src -a
Warning!!
This tool may overwrite files.
press enter or enter yes or enter Y to continue:
Processing use new-component-api transformation: 2.344s
Processing use new-global-api transformation: 1.370s
Processing use vue-router-v4 transformation: 563.495ms
Processing use vuex-v4 transformation: 541.71ms
Processing use rename-lifecycle transformation: 605.352ms
Processing use add-emit-declaration transformation: 879.03ms
Processing use vue-i18n-v9 transformation: 507.606ms
Processing use element-plus-import transformation: 524.572ms
Processing use router-update-addRoute transformation: 591.202ms
Processing use const-app transformation: 614.617ms
Processing use slot-attribute transformation: 440.388ms
Processing use slot-scope-attribute transformation: 162.384ms
Processing use v-for-template-key transformation: 163.131ms
Processing use v-bind-sync transformation: 102.651ms
Processing use remove-v-on-native transformation: 132.229ms
Processing use router-view-keep-alive-transition transformation: 130.557ms
--------------------------------------------------
Processed file:
src/utils/mUtils.js
src/components/iconSvg/index.js
src/main.js
src/lang/index.js
src/router/index.js
src/store/index.js
src/components/echarts/barChart.vue
src/components/echarts/lineChart.vue
src/components/echarts/pieChart.vue
src/components/echarts/radarChart.vue
src/page/fundData/incomePayPosition.vue
src/components/pagination/index.vue
src/page/fundList/components/addFundDialog.vue
src/page/fundList/components/searchItem.vue
src/page/permission/components/SwitchRoles.vue
src/page/share/components/hengShare.vue
src/page/share/components/infoShare.vue
src/page/share/components/inviteShare.vue
src/page/share/components/jianshuLeftShare.vue
src/page/share/components/jianshuShare.vue
src/page/share/components/juejinShare.vue
src/page/share/components/sinaShare.vue
src/page/share/components/wxCodeModal.vue
src/page/share/components/yanShare.vue
src/permission.js
src/utils/axios.js
src/layout/bread.vue
src/layout/content.vue
src/layout/footerNav.vue
src/layout/headNav.vue
src/layout/home.vue
src/layout/leftMenu.vue
src/layout/topMenu.vue
src/page/fundData/fundPosition.vue
src/page/fundData/typePosition.vue
src/page/fundList/chinaTabsList.vue
src/page/fundList/fundList.vue
src/page/infoManage/infoModify.vue
src/page/infoManage/infoShow.vue
src/page/permission/directive.vue
src/page/userList/userList.vue
src/page/fundList/moneyData/index.vue
src/page/index/components/cardList.vue
src/page/index/components/commentList.vue
src/page/index/components/logList.vue
src/page/index/components/salesTable.vue
src/page/fundList/components/chinaTabsTable.vue
src/page/login.vue
package.json
Processed 49 files
79 places need to be transformed
71 places was transformed
The transformation rate is 89.87%
The transformation stats: 

╔═══════════════════════════════════╤═══════╗
║ Rule Names                        │ Count ║
╟───────────────────────────────────┼───────╢
║ new-component-api                 │   1   ║
║ new-global-api                    │   1   ║
║ vue-router-v4                     │   1   ║
║ vuex-v4                           │   1   ║
║ rename-lifecycle                  │   5   ║
║ add-emit-declarations             │  13   ║
║ vue-i18n-v9                       │   1   ║
║ element-ui-upgrade                │   6   ║
║ const-app                         │   1   ║
║ slot-attribute                    │  15   ║
║ slot-scope-attribute              │  16   ║
║ v-for-template-key                │   3   ║
║ v-bind-sync                       │   2   ║
║ remove-v-on-native                │   3   ║
║ router-view-keep-alive-transition │   1   ║
║ package transformation            │   1   ║
╚═══════════════════════════════════╧═══════╝

The list that you need to migrate your codes manually:
index: 1
{
  path: 'src/main.js',
  position: '[7,0]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 2
{
  path: 'src/main.js',
  position: '[22,0]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 3
{
  path: 'src/lang/index.js',
  position: '[5,41]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 4
{
  path: 'src/router/index.js',
  position: '[6,41]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 5
{
  path: 'src/store/index.js',
  position: '[4,4]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 6
{
  path: 'src/directive/permission/index.js',
  position: '[4,2]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 7
{
  path: 'src/directive/permission/index.js',
  position: '[9,2]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance. ",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
index: 8
{
  path: 'src/router/index.js',
  position: '[280,6]',
  name: 'remove * routes',
  suggest: 'Catch all routes (*, /*) must now be defined using a parameter with a custom regex: ',
  website: 'https://next.router.vuejs.org/guide/migration/index.html#removal-of-the-fallback-option'
}
```

### Step 2：[将element-ui升级为element-plus](https://github.com/originjs/vue2-element-touzi-admin/commit/8cddf35dcf04165fbf997e378205c5428dcb5e7f)

Vue 3 迁移中最大的限制就是依赖，如果诸如 UI 组件之类的依赖不支持 Vue 3，那就建议你暂时不要升级，等支持了再升级；

### Step 3：[修复一些全局 API 错误](https://github.com/originjs/vue2-element-touzi-admin/commit/c1a7288299f80e23d5b1ad32f111ee10564ad8bd)

实践中发现有少部分的全局API工具是无法精准替换的，这里需要根据控制台的报错或告警信息来手动修改；

### Step 4：[修复一些与路由器升级相关的错误](https://github.com/originjs/vue2-element-touzi-admin/commit/a5c95632e44877360be95014e74229ab13e50664)

router 4 中有一些迁移的坑，有一部分 vue-codemod 已经帮我们修改了，但仍然有一些非兼容信变更需要手动修改；

### Step 5：[修复警告](https://github.com/originjs/vue2-element-touzi-admin/commit/7a123320a0d0edf32baa09534c2f7df6664ec730)

至此项目已经可以很好的运行起来了，再根据控制台的一些告警进行修复，让它更优雅的运行。

## 最后我们来看看效果图

![image-20210716101939971](https://user-images.githubusercontent.com/40830929/125884473-b89f344c-db98-4496-9d44-33b5e773c93d.png)
