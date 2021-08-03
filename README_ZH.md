# vue-codemod

> ⚠️注意: 该仓库 fork 自 [https://github.com/vuejs/vue-codemod](https://github.com/vuejs/vue-codemod)

`vue-codemod` 是一个 `Vue2` 升级 `Vue3` 的语法转换工具，能将绝大多数 `Vue2` 语法直接升级成 `Vue3` 语法，然后通过少量的手动修改完成 `Vue2` 到 `Vue3` 的平滑迁移。

## 转化率

> 转换率 = 自动修改 / (需手动修改 + 自动修改)
>
> **需手动修改** 为工具识别到的手动修改数
>
> **自动修改数** 为工具识别并自动处理的数量

| 序号 | 项目                                                         | 需手动修改 | 自动修改 | 转换率 |
| :--: | :----------------------------------------------------------- | :--------- | -------- | :------ |
|  1   | [vue2-element-touzi-admin](https://github.com/wdlhao/vue2-element-touzi-admin) | 8          | 63       | 88.73%  |
|  2   | [vue-web-os](https://github.com/a241978181/vue-web-os)       | 19         | 19       | 50.00%  |
|  3   | [amKnow](https://github.com/Arlisol/amKnow)                  | 10         | 30       | 75.00%  |
|  4   | [vue-template](https://github.com/Ashyoo/vue-template)       | 61         | 28       | 31.46%  |
|  5   | [coreui-free-vue-admin-template](https://github.com/coreui/coreui-free-vue-admin-template) | 4          | 63       | 94.03%  |
|  6   | [vue-weixin](https://github.com/bailichen/vue-weixin)        | 1          | 54       | 98.19%  |
|  7   | [vue-WeChat](https://github.com/zhaohaodang/vue-WeChat)      | 9          | 35       | 79.55%  |
|  8   | [vue2-management-platform](https://github.com/suweiteng/vue2-management-platform) | 2          | 11       | 84.62%  |
|  9   | [vue-netease-music](https://github.com/sl1673495/vue-netease-music) | 18         | 37       | 67.27%  |
|  10  | [Mall-Vue](https://github.com/PowerDos/Mall-Vue)             | 2          | 26       | 92.86%  |
|  11  | [vue-demo-kugou](https://github.com/lavyun/vue-demo-kugou)   | 4          | 13       | 76.47%  |
| 12 | [codemod-demo（codemod演示项目）](https://github.com/2kjiejie/codemod-demo/tree/master) | 0 | 24 | 100% |

## 使用指引

### 安装

> 正式版本发布时更推荐使用 `npm/yarn` 方式，如果你更想尝鲜，可以使用 `clone` 本地安装方式

#### `npm/yarn` 方式

``` bash
npm install @originjs/vue-codemod -g
//or
yarn global add @originjs/vue-codemod
```

#### `clone` 安装方式

1. 从 `github clone` 代码

```bash
git clone https://github.com/originjs/vue-codemod
```

2. 安装依赖

```bash
cd vue-codemod

npm install
//or
yarn install
```

3. 全局安装

```bash
npm run build
npm install . -g
//or
yarn run build
yarn global add .
```

### 使用

`vue-codemod` 是由一条条转换规则组成，这些转换规则位于 `transformation/index.ts` 和 `vue-transformation/index.ts` 下。

``` bash
npx vue-codemod <path> -t/-a [transformation params][...additional options]
```

1. `<path>` 表示执行的路径，可以是文件和文件夹
2. `-t` 表示具体的规则，使用 `-t` 时 `transformation param` 不可省略，`-a` 表示所有规则

#### 执行所有规则

``` bash
npx vue-codemod src -a
```

`src` 指定的是扫描的文件路径，`-a` 表示执行所有的规则转换

#### 执行单条规则

```bash
npx vue-codemod src -t new-global-api
```

`src` 指定的是扫描的文件路径，`-t new-global-api` 表示只执行 `new-global-api` 这条规则。

详细的规则列表请 [点击此处](#规则清单)

#### 规定输出格式

```bash
npx vue-codemod src -a -f log
```

`-f` 命令用于规定统计输出格式，可选参数为为 `table`、`detail` 、`log`，在没有指定参数的情况下默认为 `table`。

选择 `table` 时则会以表格的形式输出修改的规则，选择 `detail` 时会以对象形式输出具体修改的文件与规则，而选择 `log` 则会将统计报告以 log 文件的形式输出。

以下是`-f table`的输出样例：

```bash
╔═══════════════════════════════╤═══════╗
║ Rule Names                    │ Count ║
╟───────────────────────────────┼───────╢
║ new-component-api             │   1   ║
║ new-global-api                │   1   ║
║ vue-router-v4                 │   1   ║
║ vuex-v4                       │   1   ║
║ new-directive-api             │   1   ║
║ remove-vue-set-and-delete     │   2   ║
║ rename-lifecycle              │   2   ║
║ add-emit-declarations         │   1   ║
║ tree-shaking                  │   1   ║
║ slot-attribute                │   1   ║
║ slot-default                  │   1   ║
║ slot-scope-attribute          │   1   ║
║ v-for-template-key            │   2   ║
║ v-else-if-key                 │   3   ║
║ transition-group-root         │   1   ║
║ v-for-v-if-precedence-changed │   1   ║
║ remove-listeners              │   1   ║
║ remove-v-on-native            │   1   ║
╚═══════════════════════════════╧═══════╝
```

#### 手动迁移指导

在`vue-codemod`的运行过程中，会识别到需要手动修改的部分，并以对象的形式打印到控制台（如果有`-f log`命令，则会输出到log文件中），样例如下：

```null
The list that you need to migrate your codes mannually:
index: 1
{
  path: 'src/main.js',
  position: '[33,0]',
  name: 'remove Vue(global api)',
  suggest: "The rule of thumb is any APIs that globally mutate Vue's behavior are now moved to the app instance.",
  website: 'https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp'
}
```

#### 帮助

```bash
npx vue-codemod --help
```

结果如下所示

``` bash
npx vue-codemod --help
Usage: vue-codemod [file pattern]

Options:
  -t, --transformation        Name or path of the transformation module [string]
  -p, --params                Custom params to the transformation
  -a, --runAllTransformation  run all transformation module            [boolean]
  -f, --reportFormatter       Specify an output report formatter
                                                    [string] [default: "detail"]
  -h, --help                  Show help                                [boolean]
  -v, --version               Show version number                      [boolean]

Examples:
  npx vue-codemod ./src -a                  Run all rules to convert all
                                            relevant files in the ./src folder
  npx vue-codemod                           Run slot-attribute rule to convert
  ./src/components/HelloWorld.vue -t        HelloWorld.vue
  slot-attribute
```

### 迁移步骤

1. 运行 `vue-codemod` 的 `-a` 命令: `npx vue-codemod <path> -a`
2. 手动迁移 `vue-codemod` 没有覆盖到的特殊场景， 请参考 [手动迁移指南](./docs/zh/manual-guide.md).
3. 确保使用 [@vue/compat](https://github.com/vuejs/vue-next/tree/master/packages/vue-compat) 兼容包运行
4. 在开发模式下启动项目，修复运行时告警

> 注意: 尽管大部分的迁移过程可以通过工具自动实现，但是 Vue 3 和 Vue 2 仍然有一些运行时的差异，并且有一些边缘场景 vue-codemod 也没有覆盖到。因此在部署生产环境之前，务必仔细检查迁移的正确性。

### 典型迁移案例

我们 forked 了 [vue2-element-touzi-admin](https://github.com/wdlhao/vue2-element-touzi-admin)，并尝试使用 `vue-codemod` 将该项目从 Vue 2 升级到 Vue 3，我们记录了升级过程中的每一步操作，如果您感兴趣，请参考[典型迁移案例](./docs/typical-case.md)。

## 规则清单

| 规则名称                          | 描述或链接                                                   |
| --------------------------------- | ------------------------------------------------------------ |
| new-component-api                 | https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp |
| vue-class-component-v8            | https://github.com/vuejs/vue-class-component/issues/406      |
| new-global-api                    | https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp |
| vue-router-v4                     | https://next.router.vuejs.org/guide/migration/index.html#new-router-becomes-createrouter<br>https://next.router.vuejs.org/guide/migration/index.html#new-history-option-to-replace-mode<br>https://next.router.vuejs.org/guide/migration/index.html#replaced-onready-with-isready |
| vuex-v4                           | new Store (...) => createStore (...)                           |
| define-component                  | Vue.extend (...) => defineComponent (...)                      |
| new-vue-to-create-app             | https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp |
| scoped-slots-to-slots             | https://v3.vuejs.org/guide/migration/slots-unification.html#overview |
| new-directive-api                 | https://v3.vuejs.org/guide/migration/custom-directives.html#overview |
| remove-vue-set-and-delete         | https://v3.vuejs.org/guide/migration/introduction.html#removed-apis |
| rename-lifecycle                  | https://v3.vuejs.org/guide/migration/introduction.html#other-minor-changes |
| add-emit-declaration              | https://v3.vuejs.org/guide/migration/emits-option.html#overview |
| tree-shaking                      | https://v3.vuejs.org/guide/migration/global-api-treeshaking.html |
| v-model                           | https://v3.vuejs.org/guide/migration/v-model.html#overview   |
| render-to-resolveComponent        | https://v3.vuejs.org/guide/migration/render-function-api.html#registered-component |
| remove-contextual-h-from-render   | https://v3.vuejs.org/guide/migration/render-function-api.html#render-function-argument |
| remove-production-tip             | https://v3.vuejs.org/guide/migration/global-api.html#a-new-global-api-createapp |
| remove-trivial-root               | createApp ({ render: () => h (App) })  =>  createApp (App)      |
| vue-as-namespace-import           | import Vue from "vue"  => import * as Vue from "vue"         |
| slot-attribute                    | https://vuejs.org/v2/guide/components-slots.html#Deprecated-Syntax |
| slot-default                      | If  component tag did not contain a `<slot>` element, any content provided between its opening and closing tag would be discarded. |
| slot-scope-attribute              | https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots-with-the-slot-scope-Attribute |
| v-for-template-key                | https://v3.vuejs.org/guide/migration/key-attribute.html#overview |
| v-else-if-key                     | https://v3.vuejs.org/guide/migration/key-attribute.html#overview |
| transition-group-root             | https://v3.vuejs.org/guide/migration/transition-group.html#overview |
| v-bind-order-sensitive            | https://v3.vuejs.org/guide/migration/v-bind.html#overview    |
| v-for-v-if-precedence-changed     | https://v3.vuejs.org/guide/migration/v-if-v-for.html#overview |
| remove-listeners                  | https://v3.vuejs.org/guide/migration/listeners-removed.html#overview |
| v-bind-sync                       | https://v3.vuejs.org/guide/migration/v-model.html#overview   |
| remove-v-on-native                | https://v3.vuejs.org/guide/migration/v-on-native-modifier-removed.html#overview |
| router-link-event-tag             | https://next.router.vuejs.org/guide/migration/index.html#removal-of-event-and-tag-props-in-router-link |
| router-link-exact                 | https://next.router.vuejs.org/guide/migration/index.html#removal-of-the-exact-prop-in-router-link |
| router-view-keep-alive-transition | https://next.router.vuejs.org/guide/migration/index.html#router-view-keep-alive-and-transition |
