<template>
  <el-row class="H100 window">
    <el-col :span="24">444</el-col>
    <el-col :span="4" class="H100 menu">
      <left-menu></left-menu>
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