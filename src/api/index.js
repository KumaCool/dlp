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

export const mapAPI = {
  data (id, params = {}) {
    let option = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {
        geometryType: 'esriGeometryEnvelope',
        // outFields: 'Name,Strasse,权属单,探测时',
        f: 'geojson',
        ...params
      }
    }
    return axios(url.map.data(id), option)
  }
}

export const crudAPI = {
  select (api, params = {}) {
    return axios(apiPath(api), params)
  }
}

/**
 * 把以[.]格式的字符串转换成urlConfig中的真实对象
 * @param  {string} value urlConfig中对象的字符串形式
 * @return {string}       返回对应的对象URL值
 */
function apiPath (value) {
  value = value.split('.')
  let path = url
  value.forEach(v => {
    path = path[v]
  })
  return path
}
