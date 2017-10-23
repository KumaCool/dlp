import {setState} from '../fn'
import {loginAPI, perAPI} from '@/api'
// import * as TYPE from '../commitType/loginType'
import router from '@/router'

const state = {
  token: ''
}

const mutations = {
  setState
}

const actions = {
  login ({commit}, data) {
    loginAPI(data).then(() => {
      const token = getCookie('thor')
      commit('setState', {token: token})
      // 记住密码 XXX: 可以单独提取成cookie方法
      if (data.checked) {
        let date = new Date()
        date.setTime(date.getTime() + 30 * 24 * 3.6e+6) // 30天
        document.cookie = `thor=${escape(token)};expires=${date.toGMTString()}`
      }
      router.push('/')
    })
  },
  perRelation ({commit}) {
    perAPI.relation().then(res => {
      commit('setState', {
        columnData: res.columnList,
        permission: res.permissionList
      }, {root: true})
    })
  }
}

/**
 * 获取cookie
 * @param  {string} name cookie名
 * @return {string}      返回匹配的cookie值
 */
function getCookie (name) {
  let arr = document.cookie.split('; ')
  for (var i = 0; i < arr.length; i++) {
    let temp = arr[i].split('=')
    if (temp[0] === name) return unescape(temp[1])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
