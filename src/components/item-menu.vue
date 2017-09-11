<template>
  <el-submenu :index="data.id + '#' + data.url" v-if="data.item !== null">
    <template slot="title">
      <i :class="data.icon"></i>{{data.name}}
    </template>
    <template v-for="obj in data.item">
      <item-menu :data="obj"></item-menu>
    </template>
  </el-submenu>
  <el-menu-item :index="data.id + '#' + data.url" v-else>
    <i :class="data.icon"></i>{{data.name}}
  </el-menu-item>
</template>
<script>
import itemMenu from './item-menu'
export default {
  name: 'itemMenu',
  props: ['data'],
  components: {itemMenu}
}
</script>
<style scoped>
  [class^="el-icon-ion"], [class*=" el-icon-ion"] {
    font-size: 28px;
    transform: translateY(15%);
  };
</style>