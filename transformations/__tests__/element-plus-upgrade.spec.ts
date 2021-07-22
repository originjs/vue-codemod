import { defineInlineTest } from 'jscodeshift/src/testUtils'
const transform = require('../element-plus-upgrade')

defineInlineTest(
  transform,
  {},
  `import ElementUI from "element-ui";`,
  `import ElementUI from "element-plus";`,
  'correctly transform default import from element-plus'
)

defineInlineTest(
  transform,
  {},
  `import { MessageBox } from "element-ui";`,
  `import { ElMessageBox as MessageBox } from "element-plus";`,
  'correctly transform component import from element-plus'
)

defineInlineTest(
  transform,
  {},
  `import ElementUI, { MessageBox } from "element-ui";`,
  `import ElementUI, { ElMessageBox as MessageBox } from "element-plus";`,
  'correctly transform multiple imports from element-plus'
)

defineInlineTest(
  transform,
  {},
  `import locale from "element-ui/lib/locale/lang/zh-cn";`,
  `import locale from "element-plus/lib/locale/lang/zh-cn";`,
  'correctly transform import from element-plus'
)
