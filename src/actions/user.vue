<template>
  <el-row class="user" :gutter="10">
    <el-col :span="10">
      <list :config="config.list"
            :tempStatus="listStatus"
            @to-form="toForm"
            @del="del"></list>
    </el-col>
    <el-col v-if="config.forms !== ''" :span="14">
      <forms :config="config.forms" :tempStatus="tempStatus" @update="update"></forms>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
import crud from '@/store/config/crud-config'
import list from '@/actions/tables'
import forms from '@/actions/forms'
export default {
  data () {
    return {
      config: {
        list: crud['user'].list,
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
      this.$set(this.config, 'forms', crud['user'][type])
      this.tempStatus = !this.tempStatus
      if (param !== undefined) this.$set(this.config.forms, 'param', param)
    },
    update: function () {
      this.listStatus = !this.listStatus
    },
    del: function (val) {
      let config = crud['user'].delete
      let param = {}
      for (var k in config.data) {
        param[k] = val[k]
      }
      this.$http.post(config.response, param).then(response => {
        // log(response)
        this.config.forms = ''
        this.listStatus = !this.listStatus
      })
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
