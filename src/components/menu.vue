<template>
  <el-menu default-active="1" class="el-menu-vertical-demo">
    <template v-for="item in data">
      <item-menu :data="item"></item-menu>
    </template>
  </el-menu>
</template>
<script>
import itemMenu from './item-menu'
export default {
  props: ['data'],
  components: {itemMenu}
}
</script>
