<template>
  <el-menu default-active="1" :router="true" class="el-menu-vertical-demo">
  <template v-for="(item, key) in items">
    <el-submenu index="key" v-if="item.item !== null ">
      <span slot="title">{{item}}</span>
      <el-menu-item index="1-1" v-for="i in item">aaa</el-menu-item>
    </el-submenu>
    <el-menu-item v-else>
      <span>{{item}}</span>
    </el-menu-item>
  </template>

    <el-menu-item index="2">
      <span>标题二</span>
    </el-menu-item>    
  </el-menu>
</template>
<script>
export default {
  data () {
    return {
      shuju: '[{"name":"实时监控","url":null,"icon":"a","winProperty":"aaa","isTool":0,"item":[{"name":"旱情监控","url":null,"icon":"a","winProperty":"a","isTool":0,"item":[{"name":"水位监控","url":null,"icon":"a","winProperty":"aa","isTool":0,"item":null}]}]},{"name":"测试","url":null,"icon":"a","winProperty":"aaa","isTool":0,"item":null}]',
      test: [
        {message: 'Foo'},
        {message: 'Bar'}
      ]
    }
  },
  computed: {
    items: function () {
      return JSON.parse(this.shuju)
    }
  }
}
</script>