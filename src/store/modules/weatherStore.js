import {weatherAPI} from '@/api'

let state = {
  location: {}, // 本地基础数据
  dayList: [], // 多天数据
  today: {} // 今天
}

let mutations = {}

let actions = {
  weather ({commit}) {
    weatherAPI().then(res => {
      let location = {name: res.city},
          dayList = []
      commit('set_state', {location: location})

    })
  }
}
