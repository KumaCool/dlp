<template>
  <el-menu :default-active="defaultActive"
           class="left-menu el-menu-vertical-demo"
           :collapse="false"
           :unique-opened="true"
           @select="select">
      <item-menu v-for="(item, index) in data" :key="index" :data="item"></item-menu>
  </el-menu>
</template>
<script>
// import {mapGetters, mapActions} from 'vuex'
import itemMenu from '@/components/item-menu'

/**
 * 导航栏组件
 * [接收参数]
 * @param {Array} data 栏目数据
 * @param {String} defaultActive 默认激活的栏目
 *
 * [传出参数]
 * @param {Number} select 菜单激活时的回调
 */
export default {
  props: {
    data: Array,
    defaultActive: String
  },
  computed: {
    // ...mapGetters(['windowFull'])
  },
  methods: {
    select (index) {
      this.$emit('select', index)
    }
    // ...mapActions(['openWindow'])
  },
  components: {itemMenu}
}
</script>
