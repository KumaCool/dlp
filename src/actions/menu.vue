<template>
  <el-menu v-if="windowFull"
           :default-active="windowFull.id + '#' + windowFull.url"
           class="left-menu el-menu-vertical-demo"
           :collapse="false"
           :unique-opened="true"
           @select="openWindow">
      <item-menu v-for="(item, index) in data" :key="index" :data="item"></item-menu>
  </el-menu>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import itemMenu from '@/components/item-menu'

export default {
  props: ['data'],
  computed: {
    ...mapGetters(['windowFull'])
  },
  methods: {
    ...mapActions(['openWindow'])
  },
  components: {itemMenu}
}
</script>
