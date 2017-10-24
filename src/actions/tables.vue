<template>
  <el-row :class="style">
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="selectValue"
                    placeholder="用户名"
                    icon="search"
                    :on-icon-click="select"
                    @keyup.enter.native="select">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="add" icon="plus">添加</el-button>
          <el-button @click="del" icon="delete">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table max-height="700"
                :data="dataset"
                stripe
                highlight-current-row
                @current-change="edit">
          <el-table-column v-for="(item, index) in tableColumn" :key="index" :prop="index" :label="item.name"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
/**
 * CRUD下的表格操作组件
 * 用于数据以常规的表格形式操作或显示
 * @param {object} config CRUD中 created 或 edit 的配置信息
 * @param {boolean} tempStatus 数据变动的状态提示,如状态改变就将重新加载新数据
 */
import mixin from '@/mixins/crud'
export default {
  props: ['config', 'tempStatus'],
  mixins: [mixin],
  data () {
    return {
      selectValue: '',
      dataset: [], // 列表数据
      deleteTable: {}, // 预删除数据
      dictionary: {} // 字典数据
    }
  },
  computed: {
    tableColumn: function () { // 列表栏目
      return this.config.data
    }
  },
  methods: {
    add: function () { // 触发父组件添加事件
      this.$emit('to-form', 'created')
    },
    edit: function (val) { // 触发父组件修改事件
      this.deleteTable = val
      this.$emit('to-form', 'edit', val)
    },
    del: function () { // 触发父组件删除事件
      this.$confirm('删除后将无法恢复,是否要继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('del', this.deleteTable)
      }).catch(() => {})
    },
    select: function () { // 查询事件
      let param = {}
      for (var k in this.config.selectValue) {
        param[this.config.selectValue[k]] = this.selectValue
      }
      this.request(param)
    },
    request: function (params = {}) { // 拉取列表数据
      const obj = {
        api: this.config.request,
        params,
        configData: this.config.data
      }
      this.$store.dispatch('crudStore/select', obj)
      // param = param !== undefined ? {params: param} : {}
      // this.$http.get(this.config.request, param).then(response => {
      //   if (response.data.rtnCode === 200) {
      //     this.dataset = response.data.data.paginationList
      //     this.configVerify(this.config.data, this.dataset[0])
      //   }
      //   // 触发事件
      //   this.fnForeach()
      // })
    }
  }
}
</script>
