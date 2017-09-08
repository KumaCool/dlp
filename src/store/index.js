import Vue from 'vue'
import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

Vue.use(Vuex)

const store = {
  state: {
    /* eslint-disable */
    columnData: '', // 栏目数据
    window: [], // 窗口组件
    permission: '' // 用户权限
    /* eslint-enable */
  },
  getters: {
    // 格式化栏目数据,变更成树结构
    columnTree: state => {
      /**
       * 该方法主程序(子孙树算法)
       * @param  {array} arr 栏目数据
       * @param  {number} id  所属层级ID
       * @return {object}     栏目树结构
       */
      let toTree = function (arr, id) {
        let item = []
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].parentId === id) {
            let arrItem = toTree(arr, arr[i].id)
            arr[i].item = arrItem.length > 0 ? arrItem : null
            item.push(arr[i])
          }
        }
        return item
      }
      return toTree(state.columnData, '0')
    }
  },
  mutations,
  actions
}

export default new Vuex.Store(store)
