<template>
  <el-row class="user" :gutter="10">
    <el-col :span="10"><list
      :config="config.list"
      :listStatus="listStatus"
      @to-form="toForm"
      @del="del"
    ></list></el-col>
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
      tempStatus: false, // 临时请求状态器
      listStatus: false
    }
  },
  methods: {
    /**
     * 根据类型打开表单组件
     * @param  {string} type  表单组件的类型 created | edit
     * @param  {object} param request时附带的参数
     */
    toForm: function (type, param) {
      this.$set(this.config, 'forms', crud['用户管理'][type])
      this.tempStatus = !this.tempStatus
      if (param !== undefined) this.$set(this.config.forms, 'param', param)
    },
    update: function () {
      log('update')
      // this.config.forms = ''
      this.listStatus = !this.listStatus
    },
    del: function (val) {
      // log(val)
      let config = crud['用户管理'].delete
      let param = {}
      for (var k in config.data) {
        param[k] = val[k]
      }
      // log(param)
      this.$http.post(config.response, param).then(response => {
        log(response)
        this.config.forms = ''
        this.listStatus = !this.listStatus
        // this.tempStatus = !this.tempStatus
      })
      // log(val)
    }
  },
  components: {list, forms}
}
</script>
<style lang="less" scoped>
  .user{
    padding: 10px;
    min-width: 1100px;
    min-height: 600px;
    // height: 500px;
  }
</style>
