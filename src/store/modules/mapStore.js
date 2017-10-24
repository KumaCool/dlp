import {setState} from '../fn'
import {mapAPI, repairAPI} from '@/api'
import * as TYPE from '../commitType/mapType'

const state = {
  data: {},
  repairList: [] // 报修数据
}

const mutations = {
  setState,
  [TYPE.DATA_SUCCESS] (state, obj) {
    state.data[obj.key] = obj.value
  }
}

const actions = {
  mapData ({state, commit}, obj) {
    mapAPI.data(obj.id, obj.params).then(res => {
      if (Array.isArray(res.features)) commit(TYPE.DATA_SUCCESS, {key: obj.key, value: res.features})
    })
  },
  repair ({commit}) {
    repairAPI().then(res => {
      commit('setState', {repairList: res.paginationList})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
