<template>
  <el-row>
    <el-col :span="24"></el-col>
    <el-col :span="24">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="upload2">保存</el-button>
        </el-form-item>
        <template v-for="(item, index) in config.data">
          <el-form-item :label="item[0]" label-width="100px">
            <el-input v-if="item[1] === 'text' || item[1] === 'textarea' || item[1] === 'password'"
                      :type="item[1]"
                      v-model="formData[index]"
            ></el-input>
            <el-select v-else-if="item[1] === 'select'" v-model="formData[index]">
              <el-option v-for="opt in roleListData"
                         :key="opt.value"
                         :label="opt.label"
                         :value="opt.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
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
      formData: {}, // 表单数据
      roleListData: []
    }
  },
  created () {
    this.request()
    for (var k in this.config.data) {
      if (this.config.data[k][1] === 'select') {
        let actionName = this.config.data[k][2]
        this[actionName]()
      }
    }
  },
  methods: {
    onSubmit: function () { // 表单提交
      log(this.formData)
      this.$http.post(this.config.response, this.formData).then(response => {
        // log(response)
        if (response.rtnCode === 200) {
          this.$message({message: response.rtnStr, type: 'success'})
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
      this.$http.get('/sys/queryRoleList.json').then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let roleList = []
          for (var k in result.data.paginationList) {
            roleList.push({
              value: result.data.paginationList[k].id,
              label: result.data.paginationList[k].roleName
            })
          }
          this.roleListData = roleList
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
