import {setState} from '../fn'
import {repairAPI} from '@/api'

const state = {
  repairList: [] // 报修数据
}

const mutations = {
  setState
}

const actions = {
  repair ({commit}) {
    repairAPI().then(res => {
      commit('setState', {repairList: res.data.paginationList})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
