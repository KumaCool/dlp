<template>
  <el-row class="H100 app" v-if="$store.state.columnData !== ''">
    <el-row class="app-head">
      <el-col :span="24" class="head-bg"><img src="./assets/images/header.jpg"></el-col>
      <weather class="head-weather"></weather>
    </el-row>
    <el-row class="app-main">
      <el-col :span="4" class="app-left-menu">
        <left-menu :data="$store.getters.columnTree"></left-menu>
      </el-col>
      <el-col :span="20" class="app-window">
        <com-middle window="full"
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
  @bodyHeadHeight: 100px; // 框架头部的高
  .app{
    background: #E6E8ED;
  }
  .app-head{
    height: @bodyHeadHeight;
    line-height: 0;
    .head-bg{background: url('./assets/images/header_bg.jpg') repeat-x;}

    // 天气样式
    .head-weather{
      // position: absolute;
      // top: 0;
      // right: 0;
      // .H100;
      line-height: normal;
      .weather-today{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 180px;
        // background: red;
        color: #FFF;
      }
      .weather-info{
        position: absolute;
        top: 100px;
        right: 0;
        background: red;
        z-index: 1;
      }
      .weather-today-icon{
        @height: 45px;
        height: @height;
        background-repeat: no-repeat;
        background-size: @height;
      }
      .weather-icon-sunny{
        background-image: url('./assets/images/icon_weather_cloudy.png');
      }
    }
  }
  .app-main{
    position: absolute;
    top: @bodyHeadHeight;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .app-left-menu,.app-window{
    .H100;
  }
  .app-window{
    position: relative;
    overflow: hidden;
  }
</style>
