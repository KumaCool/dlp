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
  /**
   * 打开窗口组件
   * @param  {string} comName   要打开的组件名
   */
  openWindow: (state, comName) => {
    let length = state.window.length
    for (var k of state.columnData) {
      if (k.url === comName) {
        state.window.push({
          name: k.url,
          title: k.name,
          zIndex: length,
          checked: true
        })
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
