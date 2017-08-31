<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="selectValue" placeholder="用户名" @keyup.enter.native="select">
            <template slot="prepend">查询</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="add" icon="plus">添加</el-button>
          <el-button @click="del" icon="delete">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table max-height="700" :data="tableData" highlight-current-row @current-change="edit">
        <template v-for="(item, index) in tableColumn">
          <el-table-column :prop="index" :label="item.name"></el-table-column>
        </template>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
let log = console.log.bind(console)
export default {
  props: ['config', 'listStatus'],
  data () {
    return {
      selectValue: '',
      tableData: [], // 列表数据
      deleteTable: {}
    }
  },
  created () {
    this.request()
  },
  computed: {
    tableColumn: function () { // 列表栏目
      return this.config.data
    }
  },
  methods: {
    add: function () {
      this.$emit('to-form', 'created')
    },
    edit: function (val) {
      this.deleteTable = val
      this.$emit('to-form', 'edit', val)
    },
    del: function () {
      this.$confirm('删除后将无法恢复,是否要继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('del', this.deleteTable)
      }).catch(() => {})
      log(1)
    },
    select: function () {
      let param = {}
      for (var k in this.config.selectValue) {
        param[this.config.selectValue[k]] = this.selectValue
      }
      this.request(param)
    },
    request: function (param) { // 拉取列表数据
      param = param !== undefined ? {params: param} : {}
      this.$http.get(this.config.request, param).then(response => {
        this.tableData = response.data.data.paginationList
        // log('d')
        for (var k in this.config.data) {
          if (this.config.data[k].dictionary !== undefined) {
            let actionName = this.config.data[k].dictionary
            this[actionName]()
          }
        }
      })
    },
    roleList: function () { // 请求角色列表方法
      this.$http.get('/role/queryRoleList').then(response => {
        let result = response.data
        if (result.rtnCode === 200) {
          let roleList = {}
          result = result.data.paginationList
          for (var k in result) {
            roleList[result[k].id] = result[k].roleName
          }
          for (k in this.tableData) {
            var roleName = this.tableData[k].orgId
            this.$set(this.tableData[k], 'orgId', roleList[roleName])
          }
        }
      })
    }
  },
  watch: {
    listStatus: function () {
      this.request()
    }
  }
}
</script>
