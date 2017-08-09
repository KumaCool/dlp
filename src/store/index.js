import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
  state: {
    /* eslint-disable */
    columnData: '', // 栏目数据
    permission: '' // 用户权限
    /* eslint-enable */
  },
  getters: {},
  mutations: {
    /**
     * 设置 state 的值
     * @param  {object} obj   要设置的state对象
     */
    set_state: (state, obj) => {
      for (let k in obj) {
        state[k] = obj[k]
      }
    }
  }
}

export default new Vuex.Store(store)
