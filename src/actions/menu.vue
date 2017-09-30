<template>
  <el-menu :default-active="$store.state.windowFull.id + '#' + $store.state.windowFull.url"
           class="left-menu el-menu-vertical-demo"
           :collapse="false"
           :unique-opened="true"
           @select="openWindow">
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
