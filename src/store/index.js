import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
  state: {
    /* eslint-disable */
    columnData: [
        {name: '栏目1', icon: 'a', winProperty: 'a1', item: [
          {name: '二级1', icon: 'a', winProperty: 'b1', item: [
            {name: '三级1', icon: 'a', winProperty: 'c1', item: [
              {name: '四级1', icon: 'a', winProperty: 'd1', item: null},
              {name: '四级1', icon: 'a', winProperty: 'd2', item: null},
            ]},
            {name: '三级2', icon: 'a', winProperty: 'c2', item: null}
          ]},
          {name: '二级2', icon: 'a', winProperty: 'b2', item: null},
          {name: '二级3', icon: 'a', winProperty: 'b3', item: null}
        ]},
        {name: '管理', icon: 'a', winProperty: 'a2', item: null},
        {name: '栏目3', icon: 'a', winProperty: 'a3', item: null}
      ], // 栏目数据
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
    }
  }
}

export default new Vuex.Store(store)
