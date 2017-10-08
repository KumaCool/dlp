<template>
  <el-tree :data="data"
           :props="option"
           :show-checkbox="showCheckbox"
           node-key="id"
           @node-click="nodeClick"></el-tree>
</template>

<script>
// let log = console.log.bind(console)
/**
 * 树组件
 * @param {Array} data 展示数据
 * @param {array|object} props 数据与节点的对应键名
 * @param {boolean} showCheckbox 节点是否可被选择,默认关闭
 */
export default {
  props: {
    data: Array,
    props: [Array, Object],
    showCheckbox: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    /**
     * tree组件props参数格式化
     * Array类型将被转换为对应的格式,Object类型将直接应用.
     */
    option: function () {
      if (Array.isArray(this.props)) {
        return {
          label: this.props[0],
          children: this.props[1],
          disabled: this.props[2]
        }
      } else if (typeof this.props.label === 'string') return this.props
    }
  },
  methods: {
    nodeClick: function () { // 节点被点击时的回调
      this.$emit('node-click', ...arguments)
    }
  }
}
</script>
