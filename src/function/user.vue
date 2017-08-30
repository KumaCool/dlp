<template>
  <el-row class="user" :gutter="10">
    <el-col :span="10"><list :config="config.list" @to-form="toForm"></list></el-col>
    <el-col v-if="config.forms !== ''" :span="14"><forms :config="config.forms" :tempStatus="tempStatus" @update="update"></forms></el-col>
  </el-row>
</template>
<script>
let log = console.log.bind(console)
import crud from '@/store/config/crud'
import list from '@/function/list'
import forms from '@/function/forms'
export default {
  data () {
    return {
      config: {
        list: crud['用户管理'].list,
        forms: '' // 表单配置
      },
      tempStatus: false // 临时请求状态器
    }
  },
  methods: {
    /**
     * 根据类型打开表单组件
     * @param  {string} type  表单组件的类型 created | edit
     * @param  {object} param request时附带的参数
     */
    toForm: function (type, param) {
      log(this.config)
      // this.config.forms = crud['用户管理'][type]
      this.$set(this.config, 'forms', crud['用户管理'][type])
      this.tempStatus = !this.tempStatus
      // if (param !== undefined) this.config.forms.param = param
      if (param !== undefined) this.$set(this.config.forms, 'param', param)
    },
    update: function () {
      log('1')
    }
  },
  components: {list, forms}
}
</script>
<style lang="less" scoped>
  .user{
    padding: 10px;
    min-width: 1100px;
    // height: 500px;
  }
</style>
