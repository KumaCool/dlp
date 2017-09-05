<template>
  <el-row class="H100" v-if="$store.state.columnData !== ''">
    <el-row class="body-head">
      <el-col :span="24" class="head-bg"><img src="./assets/images/header.jpg"></el-col>
    </el-row>
    <el-row class="body-main">
      <el-col :span="4" class="body-left-menu">
        <left-menu :data="$store.getters.columnTree"></left-menu>
      </el-col>
      <el-col :span="20" class="body-window">
        <com-middle window="full" name="map"></com-middle>
        <template v-for="(item, index) in windowCom">
          <com-middle
            window="small"
            :index="index"
            :name="item.name"
            :title="item.title"
            :zIndex="item.zIndex"
            :checkedClass="item.checked"
            @com-close="comClose"
            @com-checked="comChecked"
          ></com-middle>
        </template>
      </el-col>
    </el-row>
  </el-row>
  <login v-else></login>
</template>

<script>
import leftMenu from '@/components/menu'
import login from '@/actions/login'

export default {
  name: 'app',
  data () {
    return {
      /* eslint-disable */
      windowCom: this.$store.state.window,
      // [
      //   {name: 'Hello', title: '您好', zIndex: 0, checked: false},
      //   {name: 'Hello', title: '测试', zIndex: 1, checked: false},
      //   {name: 'login', title: '测试2', zIndex: 2, checked: true}
      // ]
      /* eslint-enable */
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
    /**
     * 关闭指定组件窗口
     * @param  {number} index 要关闭窗口所在层级
     */
    comClose: function (index) {
      this.windowCom.splice(index, 1)
    },
    /**
     * 变更窗口层级
     * @param  {number} index 选中的窗口所在层级
     */
    comChecked: function (index) {
      let leng = this.windowCom.length
      for (let i = 0; i < leng; i++) {
        if (this.windowCom[i].zIndex > this.windowCom[index].zIndex) this.windowCom[i].zIndex--
        this.windowCom[i].checked = false
      }
      this.windowCom[index].zIndex = leng - 1
      this.windowCom[index].checked = true
    }
  },
  components: {leftMenu, login}
}
</script>
<style lang="less">
  @import './assets/css/style';
  @bodyHeadHeight: 7%; // 框架头部的高
  .body-head{
    height: @bodyHeadHeight;
    line-height: 0;
    .head-bg{background: url('./assets/images/header_bg.jpg') repeat-x;}
    // background-size: 100px;
  }
  .body-main{
    height: 100 - @bodyHeadHeight;
  }
  .body-left-menu,.body-window{
    .H100;
  }
  .body-left-menu{
    background: #666;
  }
  .body-window{
    position: relative;
    overflow: hidden;
  }
</style>
