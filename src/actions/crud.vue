<template>
  <el-row class="crud" :gutter="20">
    <el-col v-if="config.tables !== ''" :span="spanTable">
      <component class="crud-left"
                 :is="com('list')"
                 :config="config.tables"
                 :tempStatus="listStatus"
                 @to-form="toForm"
                 @del="del"></component>
    </el-col>
    <el-col v-if="config.forms !== ''" :span="spanForm">
      <forms class="crud-right"
             :config="config.forms"
             :tempStatus="tempStatus"
             @update="update"></forms>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
import crud from '@/api/crudConfig'

export default {
  props: ['com-param'],
  created () {
    let config = crud[this.comParam]
    if (config.list !== undefined) {
      this.$set(this.config, 'tables', config.list)
    } else if (config.created !== undefined) {
      this.$set(this.config, 'forms', config.created)
    } else if (config.edit !== undefined) {
      this.$set(this.config, 'forms', config.edit)
    }
  },
  data () {
    return {
      config: { // 配置数据
        tables: '', // 左侧列表
        forms: '' // 右侧表单
      },
      tempStatus: false, // 临时请求状态器
      listStatus: false
    }
  },
  computed: {
    spanTable: function () { // 表格栏(左)宽度判断,默认100%宽
      return this.config.forms === '' ? 24 : 10
    },
    spanForm: function () { // 表单栏(右)宽度判断,无表格时100%宽
      return this.config.tables === '' ? 24 : 14
    }
  },
  methods: {
    /**
     * 调用组件
     * @param  {string} comName 要调用的组件名称
     * @return {object}         返回对应的组件
     */
    requireCom: function (comName) {
      try {
        return require(`./${comName}`)
      } catch (e) {
        try {
          return require(`../components/${comName}`)
        } catch (e) {
          this.$message.error(`没有找到 ${comName} 组件`)
          // this.close()
        }
      }
    },
    /**
     * 动态加载组件
     * 根据配置类型中的com数据调用组件.
     * @param  {string} position 配置文件中的模块类型名称
     * @return {object}          返回对应的组件
     */
    com: function (position) {
      if (crud[this.comParam] === undefined && crud[this.comParam][position].com === undefined) {
        this.$message.error(`没有找到 ${this.comParam} 配置数据,请确认是否配置正确!`)
        this.$emit('close')
      } else this.config.tables = crud[this.comParam][position]
      let comPath = crud[this.comParam][position].com
      return this.requireCom(comPath)
    },
    /**
     * 根据类型打开表单组件
     * @param  {string} type  表单组件的类型 created | edit
     * @param  {object} param request时附带的参数
     */
    toForm: function (type, param) {
      this.$set(this.config, 'forms', crud[this.comParam][type])
      this.tempStatus = !this.tempStatus
      if (param !== undefined) this.$set(this.config.forms, 'param', param)
    },
    update: function () { // 通知左侧列表更新
      this.listStatus = !this.listStatus
    },
    /**
     * 删除选中的数据
     * @param  {object} val 选中的数据
     */
    del: function (val) {
      let config = crud[this.comParam].delete
      let param = {}
      for (var k in config.data) {
        param[k] = val[k]
      }
      this.$http.post(config.response, param).then(response => {
        this.config.forms = ''
        this.listStatus = !this.listStatus
      })
    }
  },
  components: {
    'tables': () => import('@/actions/tables'),
    'forms': () => import('@/actions/forms')
  }
}
</script>
