# Upgrade to Vue 3 by vue-codemod

## Summary

It has been half a year since the release of Vue 3, meanwhile, LTS support for Vue 2 will be phased out in 18 months. How to migrate the existing Vue 2 project to Vue 3 has become an issue of concern to everyone. Although Vue.js team has released a detailed migration guidance, the workload of source code upgrade and migration in practical projects is relatively large. To reduce repetitive work, we recommend a migration tool called [originjs/vue-codemod](https://github.com/originjs/vue-codemod), which can directly upgrade most of the Vue 2 syntax to Vue 3 syntax. With `vue-codemod` transformation and a small amount of manual modification, users can complete the smooth migration from Vue 2 to Vue 3.

> ⚠️Attention: Since the [`vue-codemod`](https://github.com/vuejs/vue-codemod) from Vue.js team has not been maintained for some time, the following repo is forked from Vue.js team. We are continuing to develop new features in the fork repo.

Demo project address：[vue2-element-touzi-admin](https://github.com/originjs/vue2-element-touzi-admin/tree/to-vue3)

## Global Install `vue-codemod`

```bash
npm install originjs/vue-codemod -g` 
// or
yarn add originjs/vue-codemod -g
```

## Migration Steps

### Step1：[Upgrade the source code by `vue-codemod`](https://github.com/originjs/vue2-element-touzi-admin/commit/21aeb41bf8595a7a6323a92ed9326cec4c7f5955)

> ⚠️Attention: `vue-codemod` modify the file in the source path. If you haven't use version control tools like Git or SVN, please back up your code in advance.

Command：

```bash
npx vue-codemod src -a
```

First we apply `vue-codemod` to auto upgrade the source code. Hers is the transformation log. Users can figure out which rules was executed and which files are modified.

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

### Step 2：[Upgrade elment-ui to element-plus](https://github.com/originjs/vue2-element-touzi-admin/commit/8cddf35dcf04165fbf997e378205c5428dcb5e7f)

The biggest limitation of Vue 3 migration is the dependencies. If some components in your source code don't support Vue 3, we suggest your project remain unchanged until the Vue 3 supported version release. 

### Step 3：[Fix errors or warnings from Global API](https://github.com/originjs/vue2-element-touzi-admin/commit/c1a7288299f80e23d5b1ad32f111ee10564ad8bd)

In some practical projects, we find some Global API can not be modified precisely, which need to be modified manually according to the warning message from console

### Step 4：[Fix errors or warnings from Vue router](https://github.com/originjs/vue2-element-touzi-admin/commit/a5c95632e44877360be95014e74229ab13e50664)

`vue-codemod` can migrate most of Vue router 3 syntax to router 4, but there are still some breaking change need to be modified manually according to our manual migration guide.

### Step 5：[Fix warnings in browser](https://github.com/originjs/vue2-element-touzi-admin/commit/7a123320a0d0edf32baa09534c2f7df6664ec730)

At this moment the whole project is runnable. We can also fix some warnings from the browser to make it run more gracefully.

## Here is transformed project

![image-20210716101939971](https://user-images.githubusercontent.com/40830929/125884473-b89f344c-db98-4496-9d44-33b5e773c93d.png)
