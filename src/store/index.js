import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
  state: {
    /* eslint-disable */
    columnData: '', // 栏目数据
    window: [], // 窗口组件
    permission: '' // 用户权限
    /* eslint-enable */
  },
  mutations: {
    /**
     * 设置 state 的值
     * @param  {object} obj   要设置的state对象
     */
    set_state: (state, obj) => {
      for (let k in obj) {
        state[k] = obj[k]
      }
    },
    /**
     * 打开窗口组件
     * @param  {string} com   要打开的组件名
     */
    openWindow: (state, com) => {
      console.log(com)
      let length = state.window.length
      // 判断该组件是否已经打开
      for (let i = 0; i < length; i++) {
        if (state.window[i].name === com) return
      }
      let menu = ''
      // 在菜单中寻找组件的属性
      let foreach = function (obj) {
        for (let k in obj) {
          if (obj[k].url === com) {
            menu = obj[k]
            return
          }
          if (obj[k].item) foreach(obj[k].item)
        }
      }
      foreach(state.columnData)
      state.window.push({
        name: menu.url,
        title: menu.name,
        zIndex: length,
        checked: true
      })
    }
  }
}

export default new Vuex.Store(store)
