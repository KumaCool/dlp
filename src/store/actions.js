export default {
  /**
   * 打开窗口组件预先判断该组件是否已经打开
   * @param  {string} comName   要打开的组件名
   */
  openWindow ({commit, state}, comName) {
    // 判断是否是组合模式
    comName = comName.indexOf('#') > 0 ? comName.split('#')[1] : comName

    for (var k in state.window) {
      if (state.window[k].name === comName) return commit('windowChecked', k)
    }
    commit('openWindow', comName)
  }
}
