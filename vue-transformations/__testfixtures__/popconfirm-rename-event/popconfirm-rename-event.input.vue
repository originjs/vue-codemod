<!-- Add "scoped" attribute to limit CSS to this component only -->
<template>
  <!-- Add "scoped" attribute to limit CSS to this component only -->

  <el-popconfirm  @onConfirm="del()"  @onCancel="del()" :onConfirm="tt" onCancel="tt"
  title="Are you sure to delete this?"
>
<template #reference>
  <el-button>Delete</el-button>
  </template>
</el-popconfirm>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- Add "scoped" attribute to limit CSS to this component only -->

<!-- Add "scoped" attribute to limit CSS to this component only -->

<script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
