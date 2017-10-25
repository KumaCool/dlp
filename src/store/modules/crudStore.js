import {setState} from '../fn'
import {crudAPI} from '@/api'
import * as TYPE from '../commitType/crudType'

const state = {
  errorMessage: '',
  dataList: [],
  dataForm: {},
  dictionary: {}
}

const mutations = {
  setState,
  /**
   * 配置信息与数据匹配检测 XXX: 暂时没用
   * @param  {object} configData 配置信息
   * @param  {object} data       后端数据
   */
  [TYPE.CONFIG_VERIFY] (state, configData) {
    for (var k in configData) {
      if (this.dataList[k] === undefined) this.errorMessage = `没有找到与 ${k} 配置对应的数据,请检查配置信息是否正确!`
    }
  }
}

const actions = {
  tables ({commit}, obj) {
    crudAPI.select(obj.api, obj.params).then(res => {
      // 配置与数据匹配检测
      const error = Object.keys(obj.configData).some(cK => {
        return res.paginationList[0][cK] === undefined
      })

      !error
        ? commit('setState', {dataList: res.paginationList})
        : commit('setState', {errorMessage: `没有找到与 ${error} 配置对应的数据,请检查配置信息是否正确!`})
    })
  },
  column ({commit}, obj) {
    crudAPI.select(obj.api, obj.params).then(res => {
      // 配置与数据匹配检测
      const error = Object.keys(obj.configData).some(cK => {
        return res[0][cK] === undefined
      })

      !error
        ? commit('setState', {dataList: res})
        : commit('setState', {errorMessage: `没有找到与 ${error} 配置对应的数据,请检查配置信息是否正确!`})
    })
  },
  forms ({commit}, obj) {
    crudAPI.select(obj.api, obj.params).then(res => {
      // 配置与数据匹配检测
      const error = Object.keys(obj.configData).some(cK => {
        return res[cK] === undefined
      })

      // console.log(error)
      !error
        ? commit('setState', {dataForm: res})
        : commit('setState', {errorMessage: `没有找到与 ${error} 配置对应的数据,请检查配置信息是否正确!`})
    })
  },
  post ({commit}, obj) {
    crudAPI.post(obj.api, obj.params).then(res => {
      console.log(res)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
