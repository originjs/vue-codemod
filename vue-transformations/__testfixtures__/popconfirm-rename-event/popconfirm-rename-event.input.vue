<template>
  <el-popconfirm  @onConfirm="del()"  @onCancel="del()" :onConfirm="tt" onCancel="tt"
  title="Are you sure to delete this?"
>
<template #reference>
  <el-button>Delete</el-button>
  </template>
</el-popconfirm>
</template>
