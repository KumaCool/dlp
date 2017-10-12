export default {
  /**
   * 设置 state 的值
   * @param  {object} obj   要设置的state对象
   */
  set_state: (state, obj) => {
    for (var k in obj) {
      state[k] = obj[k]
    }
  },
  // 初次显示的全屏窗口组件
  firstWindow: state => {
    if (Array.isArray(state.columnData)) {
      state.columnData.some(v => {
        if (state.website.primeWin === v.url) {
          state.windowFull = v
          return true
        }
      })
    }
  },
  /**
   * 打开窗口组件
   * @param  {string} comName   要打开的组件名
   */
  openWindow: (state, comName) => {
    let length = state.window.length
    for (var k of state.columnData) {
      if (k.url === comName && k.winProperty !== 'full') {
        state.window.push({
          name: comName,
          style: k.style,
          title: k.name,
          showTitle: k.showTitle,
          zIndex: length,
          checked: true
        })
        return
      } else if (k.url === comName) {
        state.windowFull = k
        // 打开全屏组件时清空窗口组件
        state.window.splice(0, length)
        return
      }
    }
  },
  /**
   * 关闭指定组件窗口
   * @param  {number} index 要关闭窗口所在层级
   */
  closeWindow: function (state, index) {
    state.window.splice(index, 1)
  },
  /**
   * 变更窗口层级
   * @param  {number} index 选中的窗口所在层级
   */
  windowChecked: function (state, index) {
    let length = state.window.length
    state.window.forEach(val => {
      if (val.zIndex > state.window[index].zIndex) val.zIndex--
      val.checked = false
    })
    state.window[index].zIndex = length--
    state.window[index].checked = true
  }
}
