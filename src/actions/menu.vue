<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" @select="openWindow">
    <template v-for="item in data">
      <item-menu :data="item"></item-menu>
    </template>
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
