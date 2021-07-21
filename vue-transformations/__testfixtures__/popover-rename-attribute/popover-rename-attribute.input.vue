<template>
  <el-popover
    placement='top-start'
    width='200'
    trigger='hover'
    content='content will display'
    open-delay='2000'
    close-delay='2000'>
    <el-button slot='reference'>hover me</el-button>
  </el-popover>

  <div
    open-delay='2000'
    close-delay='2000'></div>
</template>
