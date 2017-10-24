import {setState} from '../fn'
import {crudAPI} from '@/api'
import * as TYPE from '../commitType/crudType'

const state = {
  errorMessage: ''
  dataList: [],
  dictionary: {}
}

const mutations = {
  setState,
  /**
   * 配置信息与数据匹配检测
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
  select ({commit}, obj) {
    crudAPI.select(...obj).then(res => {
      commit('setState', {dataList: res.paginationList})
    }).then(() => commit(TYPE.CONFIG_VERIFY, obj.configData))
  }
}
