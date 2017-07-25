<template>
  <el-row class="H100 window">
    <el-col :span="24">444</el-col>
    <el-col :span="4" class="H100 menu">
      <left-menu :data="shuju"></left-menu>
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
</template>

<script>
import leftMenu from '@/components/menu'
export default {
  name: 'app',
  data () {
    return {
      /* eslint-disable */
      dialog: [
        {name: 'Hello', title: '您好', zIndex: 0, checked: false},
        {name: 'Hello', title: '测试', zIndex: 1, checked: false},
        {name: 'Hello', title: '测试2', zIndex: 2, checked: true}
      ],
      shuju: [
        {name: '栏目1', icon: 'a', winProperty: 'a1', item: [
          {name: '二级1', icon: 'a', winProperty: 'b1', item: [
            {name: '三级1', icon: 'a', winProperty: 'c1', item: [
              {name: '四级1', icon: 'a', winProperty: 'd1', item: null},
              {name: '四级1', icon: 'a', winProperty: 'd2', item: null},
            ]},
            {name: '三级2', icon: 'a', winProperty: 'c2', item: null}
          ]},
          {name: '二级2', icon: 'a', winProperty: 'b2', item: null},
          {name: '二级3', icon: 'a', winProperty: 'b3', item: null}
        ]},
        {name: '管理', icon: 'a', winProperty: 'a2', item: null},
        {name: '栏目3', icon: 'a', winProperty: 'a3', item: null}
      ]
      /* eslint-enable */
    }
  },
  methods: {
    /**
     * 关闭指定组件窗口
     * @param  {string} name 组件名
     */
    comClose: function (index) { // 关闭组件
      this.dialog.splice(index, 1)
    },
    comChecked: function (index) {
      let leng = this.dialog.length
      for (let i = 0; i < leng; i++) {
        if (this.dialog[i].zIndex > this.dialog[index].zIndex) this.dialog[i].zIndex--
        this.dialog[i].checked = false
      }
      this.dialog[index].zIndex = leng - 1
      this.dialog[index].checked = true
    }
  },
  components: {leftMenu}
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
