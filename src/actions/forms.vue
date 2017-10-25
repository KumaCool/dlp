<template>
  <el-row :class="style">
    <el-col :span="24"></el-col>
    <el-col :span="24">
      <el-form :model="dataset">
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="upload2">保存</el-button>
        </el-form-item>
        <el-form-item v-for="(item, index) in config.data"
                      :key="index"
                      :label="item.name + '：'"
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
          <component v-else :is="com(item.formType)" v-model="dataset[index]"></component>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import {mapState} from 'vuex'

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
      // dataset: {}, // 表单数据
      dictionary: {} // 字典数据
    }
  },
  computed: mapState('crudStore', {
    // ...mapState('crudStore', ['dataForm'])
    dataset: 'dataForm'
    // })
  }),
  methods: {
    com: function (fileName) {
      try {
        return require(`@/components/${fileName}`)
      } catch (e) {
        try {
          return require(`@/actions/${fileName}`)
        } catch (e) {
          this.$message.error(`没有找到 ${fileName} 组件`)
        }
      }
    },
    onSubmit: function () { // 表单提交
      const obj = {
        api: this.config.response,
        params: this.dataset
      }
      this.$store.dispatch('crudStore/post', obj)
      this.$emit('update') // FIXME: 异步操作导致没有更新,需要改进
    },
    request: function () { // 请求表单数据
      if (this.config.request !== undefined) {
        const obj = {
          api: this.config.request,
          params: this.config.param,
          configData: this.config.data
        }
        this.$store.dispatch('crudStore/forms', obj)
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
