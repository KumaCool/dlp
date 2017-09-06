<template>
  <el-row>
    <el-col :span="24"></el-col>
    <el-col :span="24">
      <el-form :model="dataset">
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="upload2">保存</el-button>
        </el-form-item>
        <el-form-item v-for="(item, index) in config.data"
                      :key="index"
                      :label="item.name"
                      label-width="100px">
          <el-input v-if="item.formType === 'text' || item.formType === 'textarea' || item.formType === 'password'"
                    :type="item.formType"
                    v-model="dataset[index]"></el-input>
          <el-select v-else-if="item.formType[0] === 'select'" v-model="dataset[index]">
            <el-option v-if="item.formType[1] !== undefined"
                       :label="item.formType[2]"
                       :value="item.formType[1]"></el-option>
            <el-option v-for="opt in dictionary[index]"
                       :key="opt.value"
                       :label="opt.label"
                       :value="opt.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
// let log = console.log.bind(console)
/**
 * CRUD下的表单操作组件
 * 用于数据以常规的表单形式添加与修改
 * @param {object} config CRUD中 created 或 edit 的配置信息
 * @param {boolean} tempStatus 数据变动的状态提示,如状态改变就将重新加载新数据
 */
import mixin from '@/mixins/crud'
export default {
  props: ['config', 'tempStatus'],
  mixins: [mixin],
  data () {
    return {
      dataset: {}, // 表单数据
      dictionary: {} // 字典数据
    }
  },
  methods: {
    onSubmit: function () { // 表单提交
      // log(this.dataset)
      this.$http.post(this.config.response, this.dataset).then(response => {
        let type = 'error'
        if (response.data.rtnCode === 200) {
          type = 'success'
          this.$emit('update')
        }
        this.$message({message: response.data.rtnStr, type: type})
      })
    },
    request: function () { // 请求表单数据
      // log(this.$route)
      if (this.config.request !== undefined) {
        this.$http.get(this.config.request, {params: this.config.param}).then(response => {
          if (response.data.rtnCode === 200) {
            this.dataset = response.data.data
          }
        })
      } else {
        // 初始化表单
        let data = {}
        for (var k in this.config.data) {
          data[k] = ''
        }
        this.$set(this, 'dataset', data)
      }
      // 触发事件
      this.fnForeach()
    }
  }
}
</script>
