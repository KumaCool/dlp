import * as url from './urlConfig'
import statusCode from './statusCode'
import axios from 'axios'

// 白名单,用于忽略API的格式验证.
const whiteLists = [
  url.weather
]

// 设置API路径与跨域
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

// 拦截器
axios.interceptors.response.use(
  config => {
    let data = config.data,
        url = axios.defaults.baseURL + config.config.url
    // 过滤白名单
    if (whiteLists.some(v => v === url)) return data
    // 接口验证
    if (data.rtnCode === undefined) return console.error('远程接口格式不正确')
    return data.rtnCode === 200 ? data.data : statusCode(data.rtnCode)
  },
  () => {
    console.log(arguments)
  }
)

export function webconfigAPI () {
  return axios(url.webconfig, {params: {id: 1}})
}

export function loginAPI (data) {
  return axios.post(url.login, data, {params: data}) // XXX: 传参需要改回POST方式
}

export const perAPI = {
  relation () {
    return axios(url.per.relation)
  }
}

export function weatherAPI () {
  return axios(url.weather)
}
