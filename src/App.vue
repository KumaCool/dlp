<template>
  <el-row class="H100 app" v-if="$store.state.columnData !== ''">
    <el-row class="app-head">
      <el-col :span="24" class="head-bg">
        <span class="head-logo"><img src="./assets/images/logo.png"></span>
        <img src="./assets/images/header.jpg">
      </el-col>
      <el-row class="head-menu"
              type="flex"
              justify="end"
              :gutter="10">
        <el-col :span="3"><weather class="head-weather"></weather></el-col>
      </el-row>
    </el-row>
    <el-row class="app-main">
      <el-col :span="4" class="app-left-menu">
        <left-menu :data="$store.getters.columnTree"></left-menu>
      </el-col>
      <el-col :span="20" class="app-window">
        <com-middle v-if="$store.state.windowFull !== {}"
                    window="full"
                    :name="$store.state.windowFull.url"
                    :title="$store.state.windowFull.name"
                    :showTitle="$store.state.windowFull.showTitle"></com-middle>
        <template v-for="(item, index) in windowCom">
          <com-middle window="small"
                      :index="index"
                      :name="item.name"
                      :title="item.title"
                      :zIndex="item.zIndex"
                      :checkedClass="item.checked"
                      @com-close="closeWindow"
                      @com-checked="windowChecked"
          ></com-middle>
        </template>
      </el-col>
    </el-row>
  </el-row>
  <login v-else></login>
</template>

<script>
import { mapMutations } from 'vuex'

import leftMenu from '@/actions/menu'
import login from '@/actions/login'
import weather from '@/actions/weather'

export default {
  name: 'app',
  data () {
    return {
      windowCom: this.$store.state.window
    }
  },
  created () {
    document.getElementById('app').style.display = 'block'
  },
  computed: {
    url: function () { // 路由用,暂无用的方法
      let path = new Array(this.windowCom.length)
      this.windowCom.forEach(function (v) {
        path[v.zIndex] = v.name
      })
      console.log(this.$store)
      return path.join('/')
    }
  },
  methods: {
    ...mapMutations(['closeWindow', 'windowChecked'])
  },
  components: {leftMenu, login, weather}
}
</script>
<style lang="less">
  @import './assets/css/style';
  @import './assets/css/DLPlatform';
</style>
