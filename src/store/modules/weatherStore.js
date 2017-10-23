import {setState} from '../fn'
import {weatherAPI} from '@/api'

const state = {
  location: {}, // 本地基础数据
  dayList: [], // 多天数据
  today: {} // 今天
}

const mutations = {
  setState
}

const actions = {
  weather ({commit}) {
    weatherAPI('铜陵').then(res => {
      let location = {name: res.city},
          dayList = [],
          today
      for (var i = 0; i < 4; i++) {
        dayList.push({
          date: res.data.forecast[i].date.substr(-3),
          code_day: dayToCode(res.data.forecast[i].type),
          text_day: res.data.forecast[i].type,
          low: parseInt(res.data.forecast[i].low.replace(/[^((\d)+.\d)]/g, '')),
          high: parseInt(res.data.forecast[i].high.replace(/[^((\d)+.\d)]/g, '')),
          wind_direction: res.data.forecast[i].fx
        })
      }
      today = dayList.splice(0, 1)[0]
      today.temperature = res.data.wendu
      commit(
        'setState',
        {
          location,
          dayList,
          today
        }
      )
    })
  }
}

/**
 * 日期转换成编码
 * @param  {string} val 日期值
 * @return {integer}     返回相应的编码
 */
function dayToCode (val) {
  switch (true) {
    case /阴/.test(val):
      return 9
    case /阵/.test(val):
      return 10
    case /雨|雪/.test(val):
      return 13
    case /云/.test(val):
      return 4
    case /晴/.test(val):
      return 3
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
