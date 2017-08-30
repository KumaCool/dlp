<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" :model="form">
        <el-form-item>
          <el-input v-model="form.name" placeholder="姓名">
            <template slot="prepend">查询</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add" icon="plus">添加</el-button>
          <el-button type="primary" @click="" icon="delete">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table :data="tableData" highlight-current-row @current-change="edit">
        <template v-for="(item, index) in tableColumn">
          <el-table-column :prop="index" :label="item[0]"></el-table-column>
        </template>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
export default {
  props: ['config'],
  data () {
    return {
      form: {
        name: ''
      },
      tableData: [] // 列表数据
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
      // log(val.id)
      this.$emit('to-form', 'edit', val)
    },
    request: function () { // 拉取列表数据
      this.$http.get(this.config.request).then(response => {
        this.tableData = response.data.data.paginationList
      })
    }
  }
}
</script>
