import * as url from './url-config'
import axios from 'axios'

// 拦截器
axios.interceptors.response.use(
  config => {
    console.log('d')
  },
  () => {
    console.log(arguments)
  }
)

export function loginAPI (data) {
  return ajax(url.login, data)
}

export const perAPI = {
  relation: () => ajax(url.per.relation)
}

function ajax (options, data) {
  if (typeof options === 'string') {
    options = {
      url: options,
      methods: 'get'
    }
  }
  if (data !== undefined) options.data = data
  return axios(...options)
}
