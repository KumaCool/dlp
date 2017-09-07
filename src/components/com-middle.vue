<template>
  <el-row :class="comClass" :style="[{zIndex: zIndex}, offset]" @mousedown.native="checked">
    <el-col :span="24" class="dialog_header"
      :class="checkedClass ? 'checked' : ''"
      v-if="window !== 'full'"
      v-drag="positionUpdate"
    >
      {{title}}<i class="el-icon-close" @click="close"></i>
    </el-col>
    <el-col :span="24">
      <component :is="com" :com-param="param" @close="close"></component>
    </el-col>
  </el-row>
</template>
<script>
/**
 * 组件调用的中间件
 * [ 接收参数 ]
 * @param {number} index 组件标识
 * @param {string} window 窗口大小 small(默认)/full
 * @param {string} name 调用组件名,它可以有组合形式 fileName.param
 * @param {string} title 窗口标题
 * @param {number} zIndex 窗口层级
 * @param {boolean} checkedClass 顶层样式判断
 *
 * [监听参数]
 * @param {string} close 关闭本窗口组件
 *
 * 如何该中间件的参数name接收到的是组合模式,
 * 它会打散成数组并把除第一元素外以参数的形式传给要调用的组件
 * [ 传出参数 ]
 * @param {array} comParam 组件的参数
 */
export default {
  props: ['index', 'window', 'name', 'title', 'zIndex', 'checkedClass'],
  data () {
    return {
      offset: '', // 窗口坐标值
      fileName: '', // 组件的文件名
      param: '' // 调用组件的附加参数
    }
  },
  computed: {
    comClass: function () { // 本中间件组件的主框架样式名
      return this.window === 'full' ? 'full' : 'wrapper small'
    },
    com: function () { // 调用组件
      let arr = this.name.split('.')
      this.fileName = arr[0]
      arr.shift()
      this.param = arr
      try {
        return require(`./${this.fileName}`)
      } catch (e) {
        try {
          return require(`../actions/${this.fileName}`)
        } catch (e) {
          this.$message.error(`没有找到 ${this.fileName} 组件`)
          this.close()
        }
      }
    }
  },
  methods: {
    positionUpdate: function (val) { // 更新窗口坐标
      this.offset = {
        top: val.top + 'px',
        left: val.left + 'px'
      }
    },
    close: function () { // 通知父级关闭本窗口组件
      this.$emit('com-close', this.index)
    },
    checked: function () { // 通知升级至顶层
      this.$emit('com-checked', this.index)
    }
  },
  directives: {
    drag: { // 拖拽指令
      inserted: (el, {value}, vnode) => {
        el.onmousedown = (e) => {
          document.onselectstart = () => false
          let params = {
            top: parseInt(vnode.elm.parentNode.offsetTop),
            left: parseInt(vnode.elm.parentNode.offsetLeft),
            disY: e.clientY,
            disX: e.clientX
          }
          document.onmousemove = (e) => {
            value({
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
  }
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
    @height: 30px;
    padding: 0 5px;
    height: @height;
    line-height: @height;
    background: #58B7FF;
    color: #FFF;
    cursor: move;
    & > i{
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 10px;
      cursor: pointer;
    }
  }
  .checked{background: #1D8CE0;}
  .full{
    .W100;
    .H100;
    z-index: 0;
    .el-col{.H100;}
  }
  .small{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
