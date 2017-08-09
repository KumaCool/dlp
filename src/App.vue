<template>
  <el-row class="H100 window" v-if="columnData !== ''">
    <el-col :span="24">444</el-col>
    <el-col :span="4" class="H100 menu">
      <left-menu :data="$store.state.columnData"></left-menu>
    </el-col>
    <el-col :span="20" class="H100 main">
      <com-middle window="full" name="Hello"></com-middle>
      <template v-for="(item, index) in dialog">
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
  <login @check="check" v-else></login>
</template>

<script>
import leftMenu from '@/components/menu'
import login from './components/login'
export default {
  name: 'app',
  data () {
    return {
      /* eslint-disable */
      dialog: [
        {name: 'Hello', title: '您好', zIndex: 0, checked: false},
        {name: 'Hello', title: '测试', zIndex: 1, checked: false},
        {name: 'login', title: '测试2', zIndex: 2, checked: true}
      ],
      columnData: ''
      /* eslint-enable */
    }
  },
  methods: {
    /**
     * 关闭指定组件窗口
     * @param  {number} index 要关闭窗口所在层级
     */
    comClose: function (index) {
      this.dialog.splice(index, 1)
    },
    /**
     * 变更窗口层级
     * @param  {number} index 选中的窗口所在层级
     */
    comChecked: function (index) {
      let leng = this.dialog.length
      for (let i = 0; i < leng; i++) {
        if (this.dialog[i].zIndex > this.dialog[index].zIndex) this.dialog[i].zIndex--
        this.dialog[i].checked = false
      }
      this.dialog[index].zIndex = leng - 1
      this.dialog[index].checked = true
    },
    check: function (param) {
      this.columnData = param
    }
  },
  components: {leftMenu,login}
}
</script>
<style lang="less">
  @import './assets/css/style';
  .menu{
    background: #666;
  }
  .window{overflow: hidden;}
  .main{
    position: relative;
    overflow: hidden;
  }
</style>
