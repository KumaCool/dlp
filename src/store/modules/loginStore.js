import { loginAPI } from '@/api'

let state = {
  token: ''
}

let actions = {
  login ({commit}, data) {
    loginAPI(data).then(res => commit('set_state', {token: res}))
  }
}

export default {
  state,
  actions
}
