<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" @select="openWindow">
    <template v-for="item in data">
      <item-menu :data="item"></item-menu>
    </template>
  </el-menu>
</template>
<script>
import itemMenu from './item-menu'
export default {
  props: ['data'],
  methods: {
    openWindow: function (index) {
      this.$store.commit('openWindow', index.split('.')[1])
    }
  },
  components: {itemMenu}
}
</script>
