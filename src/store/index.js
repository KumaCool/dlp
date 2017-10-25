import Vue from 'vue'
import Vuex from 'vuex'
// import io from 'socket.io-client'

import mutations from './mutations'
import actions from './actions'

import loginStore from './modules/loginStore'
import weatherStore from './modules/weatherStore'
import mapStore from './modules/mapStore'
import crudStore from './modules/crudStore'

Vue.use(Vuex)

const store = {
  state: {
    /* eslint-disable */
    website: {}, // 网站配置
    columnData: '', // 栏目数据
    window: [], // 窗口组件
    // windowFull: {url: 'map'}, // 全屏组件名, 第二参数为是否显示标题
    permission: '', // 用户权限
    repair: [] // 报修数据
    // socket: io.connect('http://116.62.225.78:9002')
    /* eslint-enable */
  },
  getters: {
    // 初次显示的全屏窗口组件
    windowFull: state => {
      if (Array.isArray(state.columnData)) {
        let com
        state.columnData.some(v => {
          if (state.website.primeWin === v.url) {
            com = v
            return true
          }
        })
        return com
      }
    },
    // comUrlFormat: state => {
    //   return comUrl => {
    //     if (Array.isArray(comUrl)) {
    //       return comUrl.splice(2).join('#')
    //     } else if (typeof comUrl === 'string') {
    //       comUrl.slice(comUrl.indexOf('#'))
    //       console.log(comUrl)
    //     }
    //   }
    // },
    // 转换报修数据内容
    repairFormat: state => {
      let arr = state.repair.map(v => {
        switch (v.problemType) {
          case 1:
            v.problemType = '积水点'
            break
          case 2:
            v.problemType = '隐患'
            break
          case 3:
            v.problemType = '违章'
            break
        }
        v.submitTime = new Date(v.submitTime).toLocaleString()
        return v
      })
      return arr
    },

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
  actions,
  modules: {
    loginStore,
    weatherStore,
    mapStore,
    crudStore
  }
}

export default new Vuex.Store(store)
