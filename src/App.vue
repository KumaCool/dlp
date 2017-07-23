<template>
  <el-row class="H100 window">
    <el-col :span="24">444</el-col>
    <el-col :span="4" class="H100 menu">
      <left-menu :data="shuju"></left-menu>
    </el-col>
    <el-col :span="20" class="H100 main">
      <com-middle class="dialog" window="full" name="Hello"></com-middle>
      <com-middle class="dialog" window="small" name="Hello"></com-middle>
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
        {name: '栏目2', icon: 'a', winProperty: 'a2', item: null},
        {name: '栏目3', icon: 'a', winProperty: 'a3', item: null}
      ]
      /* eslint-enable */
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