<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" @select="openWindow">
      <item-menu v-for="(item, index) in data" :key="index" :data="item"></item-menu>
  </el-menu>
</template>
<script>
import {mapActions} from 'vuex'
import itemMenu from '@/components/item-menu'

export default {
  props: ['data'],
  methods: {
    ...mapActions(['openWindow'])
  },
  components: {itemMenu}
}
</script>
