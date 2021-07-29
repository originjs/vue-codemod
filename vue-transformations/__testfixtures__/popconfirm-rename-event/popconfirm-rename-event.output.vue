<template>
  <el-popconfirm  @confirm="del()"  @cancel="del()" :onConfirm="tt" onCancel="tt"
  title="Are you sure to delete this?"
>
<template #reference>
  <el-button>Delete</el-button>
  </template>
</el-popconfirm>
</template>
