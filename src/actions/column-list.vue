<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="add" icon="plus">添加</el-button>
          <el-button @click="del" icon="delete">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-menu default-active="1"
               class="el-menu-vertical-demo"
               @select="edit"
               @open="edit"
               @close="edit">
        <template v-for="item in dataset">
          <item-menu :data="item"></item-menu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
import itemMenu from '@/components/item-menu'
/**
 * CRUD下的栏目显示组件
 * 用于把数据展示为树型结构进行操作
 * @param {object} config CRUD中 list 的配置信息
 * @param {boolean} listStatus 数据变动的状态提示,如状态改变就将重新加载新数据
 */
import mixin from '@/mixins/crud'
export default {
  props: ['config', 'tempStatus'],
  mixins: [mixin],
  data () {
    return {
      dataset: [], // 列表数据
      selectValue: '',
      deleteTable: {} // 预删除数据
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
    add: function () { // 触发父组件添加事件
      this.$emit('to-form', 'created')
    },
    edit: function (index) { // 触发父组件修改事件
      index = {id: index.split('#')[0]}
      this.deleteTable = index
      this.$emit('to-form', 'edit', index)
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
    select: function (val) { // 查询事件
      let param = {}
      for (var k in this.config.selectValue) {
        param[this.config.selectValue[k]] = this.selectValue
      }
      this.request(param)
    },
    request: function (param) { // 拉取列表数据
      param = param !== undefined ? {params: param} : {}
      this.$http.get(this.config.request, param).then(response => {
        this.$store.commit('set_state', {columnData: response.data.data})
        this.dataset = this.$store.getters.columnTree
        // 触发事件
        this.fnForeach()
      })
    }
  },
  watch: {
    tempStatus: function () {
      // log('ok')
      this.request()
    }
  },
  components: {itemMenu}
}
</script>
