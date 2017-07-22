<template>
  <div class="wrapper" :class="window" :style="offset">
    <div class="dialog_header"
      v-if="window !== 'full'"
      v-drag="positionUpdate"
      >流量分析</div>
    <component :is="com"></component>
  </div>
</template>
<script>
/**
 * dialog组件
 * @window [string] 窗口大小 tiny/small(默认)/large/full
 * @name [string] 调用组件名
 */
export default {
  data () {
    return {
      offset: ''
    }
  },
  methods: {
    positionUpdate: function (val) {
      this.offset = {
        top: val.top + 'px',
        left: val.left + 'px'
      }
    }
  },
  computed: {
    com: function () { // 调用组件
      return require(`./${this.name}`)
    }
  },
  directives: {
    drag: { // 拖拽指令
      inserted: (el, binding, vnode) => {
        el.onmousedown = (e) => {
          document.onselectstart = () => false
          let params = {
            top: parseInt(vnode.elm.parentNode.offsetTop),
            left: parseInt(vnode.elm.parentNode.offsetLeft),
            disY: e.clientY,
            disX: e.clientX
          }
          document.onmousemove = (e) => {
            binding.value({
              top: e.clientY - params.disY + params.top,
              left: e.clientX - params.disX + params.left
            })
            if (el.preventDefault) el.preventDefault()
          }
          document.onmouseup = (e) => {
            document.onmousemove = document.onmouseup = null
            document.onselectstart = () => true
          }
        }
      }
    }
  },
  props: ['window', 'name']
}
</script>
<style lang="less" scoped>
  @import '../assets/css/less';
  .wrapper{
    position: absolute;
    box-shadow: 0 0 10px 1px #CCC;
    background: #FFF;
  }
  .dialog_header{
    background: red;
    cursor: move;
  }
  .full{
    .W100;
    .H100;
  }
  .small{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>