<template>
  <el-submenu :index="data.winProperty" v-if="data.item !== null">
    <template slot="title"><span>{{data.name}}</span></template>
    <template v-for="obj in data.item">
      <item-menu :data="obj"></item-menu>
    </template>
  </el-submenu>
  <el-menu-item :index="data.winProperty" @click="click(data.url)" v-else>{{data.name}}</el-menu-item>
</template>
<script>
import itemMenu from './item-menu'
export default {
  name: 'itemMenu',
  props: ['data'],
  methods: {
    click: function (com) {
      this.$store.commit('openWindow', com)
    }
  },
  components: {itemMenu}
}
</script>
