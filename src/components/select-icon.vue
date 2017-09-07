<template>
  <el-row>
    <el-col :span="3">
      <i :class="'icon-now ' + nowIcon"></i>
      <el-select v-model="nowIcon"
                 ref="input"
                 placeholder=""
                 popper-class="select-icon"
                 @change="formReturn">
        <el-option v-for="(item, index) in iconArr"
                   :key="index"
                   :value="'el-icon-ion-' + item"
                   class="option">
          <i :class="'el-icon-ion-' + item"></i>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
/**
 * 自定义图标选择器
 */
import icon from '@/store/config/icon'
export default {
  props: ['value'],
  data () {
    return {
      nowIcon: '', // 选中图标
      iconArr: icon // 图标集
    }
  },
  methods: {
    /**
     * 反馈表单选中值
     * @param  {string} val 选中表单值
     */
    formReturn: function (val) {
      this.$emit('input', val)
    }
  },
  watch: {
    /**
     * 同步v-model的表单值
     * @param  {string} val 最新值
     */
    value: function (val) {
      this.nowIcon = val
    }
  }
}
</script>
<style lang="less">
  .icon-now{
    position: absolute;
    margin: 5px;
    padding: 3px 8px 7px;
    width: 14px;
    height: 14px;
    font-size: 20px;
    border: #CCC 1px solid;
    background: #FFF;
    z-index: 1;
  }
  .select-icon .el-select-dropdown__list{
    width: 400px; // 选择器弹出层的宽度
    .option{
      padding-top: 3px;
      width: 35px;
      font-size: 20px;
      float: left;
    }
  }
</style>
