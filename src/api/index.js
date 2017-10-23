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
        url = config.config.url
    // 过滤白名单
    if (whiteLists.some(v => axios.defaults.baseURL + v === url)) return data
    // 接口验证
    if (data.rtnCode === undefined) return console.error('远程接口格式不正确')
    return data.rtnCode === 200 ? data.data : statusCode(data.rtnCode, data.rtnStr)
  },
  (err) => {
    return statusCode(err.response.status, err.response.data)
  }
)

export function webconfigAPI () {
  return axios(url.webconfig, {params: {id: 1}})
}

export function loginAPI (data) {
  return axios.post(url.login, data)
}

export const perAPI = {
  relation () {
    return axios(url.per.relation)
  }
}

export function weatherAPI (city) {
  return axios(url.weather, {params: {city}})
}

export function repairAPI () {
  return axios(url.repair)
}
