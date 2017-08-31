<template>
  <el-row>
    <el-col :span="24"></el-col>
    <el-col :span="24">
      <el-form :model="formData">
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="upload2">保存</el-button>
        </el-form-item>
        <el-form-item v-for="(item, index) in config.data"
                      :key="index"
                      :label="item.name"
                      label-width="100px">
          <el-input v-if="item.formType === 'text' || item.formType === 'textarea' || item.formType === 'password'"
                    :type="item.formType"
                    v-model="formData[index]"></el-input>
          <el-select v-else-if="item.formType === 'select'" v-model="formData[index]">
            <el-option v-for="opt in dictionary[item.dictionary]"
                       :key="opt.value"
                       :label="opt.label"
                       :value="opt.value"
                       ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
let log = console.log.bind(console)
export default {
  props: ['config', 'tempStatus'],
  data () {
    return {
      formData: {orgId: ''}, // 表单数据
      dictionary: {}
    }
  },
  created () {
    this.request()
    for (var k in this.config.data) {
      if (this.config.data[k].formType === 'select') {
        let actionName = this.config.data[k].dictionary
        this[actionName]()
      }
    }
  },
  methods: {
    onSubmit: function () { // 表单提交
      log(this.formData)
      this.$http.post(this.config.response, this.formData).then(response => {
        if (response.data.rtnCode === 200) {
          this.$message({message: response.data.rtnStr, type: 'success'})
          // log('ok')
          this.$emit('update')
        }
      })
    },
    request: function () { // 请求表单数据
      if (this.config.request !== undefined) {
        this.$http.get(this.config.request, {params: this.config.param}).then(response => {
          this.formData = response.data.data
        })
      } else {
        // 初始化表单
        for (var k in this.config.data) {
          this.formData[k] = ''
        }
      }
    },
    roleList: function () { // 请求角色列表方法
      this.$http.get('/role/queryRoleList').then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let roleList = []
          for (var k in result.data.paginationList) {
            roleList.push({
              value: result.data.paginationList[k].id,
              label: result.data.paginationList[k].roleName
            })
          }
          this.$set(this.dictionary, 'roleList', roleList)
        }
      })
    }
  },
  watch: {
    tempStatus: function () { // 监控其它组件事件触发更新请求
      this.request()
    }
  }
}
</script>
