<template>
  <el-row class="curd" :gutter="20">
    <el-col :span="span">
      <component class="curd-left"
                 :is="com"
                 :config="config.tables"
                 :tempStatus="listStatus"
                 @to-form="toForm"
                 @del="del"></component>
    </el-col>
    <el-col v-if="config.forms !== ''" :span="14">
      <forms class="curd-right"
             :config="config.forms"
             :tempStatus="tempStatus"
             @update="update"></forms>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
import crud from '@/store/config/crud-config'

export default {
  props: ['com-param'],
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
    span: function () { // 左侧栏宽度判断,默认100%宽
      return this.config.forms === '' ? 24 : 10
    },
    com: function () { // 动态加载组件
      // 加载配置信息
      if (crud[this.comParam] === undefined) {
        this.$message.error(`没有找到 ${this.comParam} 配置数据,请确认是否配置正确!`)
        this.$emit('close')
      } else this.config.tables = crud[this.comParam].list

      let comName = 'tables'
      switch (this.comParam[0]) {
        case 'column': // 栏目模块
          comName = 'column'
          break
      }
      return comName
    }
  },
  methods: {
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
    'forms': () => import('@/actions/forms'),
    'column': () => import('@/actions/column-list')
  }
}
</script>
