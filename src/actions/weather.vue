<template>
    <el-row v-if="daily.length > 0" class="weather-today" @mouseover.native="showInfo">
      <el-col :span="10" :class="'weather-icon weather-icon-' + weatherIcon(now.code_day)"></el-col>
      <el-col :span="14">今天<br>{{now.low}}&#8451;&sim;{{now.high}}&#8451;</el-col>

      <el-col v-show="show" class="weather-info">
        <el-row :class="'weather-info-main weather-bg-' + weatherIcon(now.code_day)">
          <el-row class="weather-info-today"
                  type="flex"
                  justify="center">
            <el-col :span="9" :class="'weather-info-today-icon weather-icon-' + weatherIcon(now.code_day)"></el-col>
            <el-col :span="10">{{location.name}}<br><span>{{now.temperature}}&#8451;</span>{{daily[0].text_day}}&nbsp;&nbsp;{{daily[0].wind_direction}}</el-col>
          </el-row>

          <el-row class="weather-info-list">
            <el-col v-for="(v, index) in dailyNoToday"
                    :key="index"
                    :span="8">
              <span>{{dayCalc(index, v.date)}}</span>
              <span :class="'weather-icon weather-icon-' + weatherIcon(v.code_day)"></span>
              <span>{{v.low}}&#8451;&frasl;{{v.high}}&#8451;</span>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
<!--   <el-row v-if="daily.length > 0">
    <el-row class="weather-info">
      <el-row clsss="weather-info-today">
        <el-col :span="8" :class="'weather-info-today-icon ' + weatherIcon(daily[0].code_day)"></el-col>
        <el-col :span="16">今天<br>{{daily[0].low}}&#8451;&sim;{{daily[0].high}}&#8451;</el-col>
      </el-row>
      <el-row class="weather-info-list">
        <el-col></el-col>
      </el-row>
    </el-row>
  </el-row>
 --></template>
<script>
let log = console.log.bind(console)

export default {
  created () {
    this.getData('/json.shtml', {city: '铜陵'}).then(v => {
      this.location = {name: v.city}
      let dayList = []
      for (var i = 0; i < 4; i++) {
        dayList.push({
          date: v.data.forecast[i].date,
          code_day: this.dayToCode(v.data.forecast[i].type),
          text_day: v.data.forecast[i].type,
          low: parseInt(v.data.forecast[i].low.replace(/[^((\d)+.\d)]/g, '')),
          high: parseInt(v.data.forecast[i].high.replace(/[^((\d)+.\d)]/g, '')),
          wind_direction: v.data.forecast[i].fx
        })
      }
      this.now = dayList.splice(0, 1)[0]
      log(this.now.date.substr(1, 2))
      // log(this.now.date.replace(this.now.date.substr(1, 4), ''))
      // v.data.forecast.forEach(dV => {
      // })
      this.daily = dayList
      // let test = v.data.forecast[0].high.replace(/[^((\d)+.\d)]/g, '')
      // log(test)
    })
    // this.getData('/weather/daily.json', {start: 0, days: 4}).then(v => {
    //   this.daily = v.results[0].daily
    //   this.location = v.results[0].location
    // })
    // this.getData('/weather/now.json').then(v => {
    //   this.now = v.results[0].now
    // })
  },
  data () {
    return {
      show: false,
      now: {},
      daily: [], // 每天天气数据
      location: {} // 本地基础数据
    }
  },
  computed: {
    dailyNoToday: function () {
      // let temp = this.daily
      // temp.splice(0, 1)
      // log(this.daily)
      return this.daily
    }
    // now: function () {
    //   // log(this.daily.length >)
    //   if (this.daily.length > 0) return this.daily[0]
    // }
  },
  methods: {
    /**
     * 获取数据
     * @param  {string} url    请求API
     * @param  {object} params API请求附带参数
     * @return {promise}        数据将以promise对象返回
     */
    getData: function (url, params = {}) {
      if (url === undefined || url === '' || typeof params !== 'object') return this.$message({message: 'Weather.getData: 传入参数不正确', type: 'error'})
      let option = {
        // baseURL: '/weather',
        baseURL: '/sojson',
        params: {
          key: 'fcldhx7li1dlr7az',
          location: '30.921775877611857:117.77711665257813',
          ...params
        }
      }
      return new Promise(resolve => {
        this.$http.get(url, option).then(response => {
          log()
          if (response.status === 200) resolve(response.data)
        })
      })
      // this.$http.get(url, option)
    },
    weatherIcon: function (val) {
      // 晴
      if (val <= 3) return 'sunny'
      // 多云
      if (val > 3 && val <= 8) return 'cloudy'
      // 阴
      if (val === '9') return 'overcast'
      // 阵雨
      if (val > 9 && val <= 12) return 'shower'
      // 雨与其它
      if (val > 12) return 'rain'
    },
    dayCalc: function (val, date) {
      switch (val) {
        case 0:
          return '明天'
        case 1:
          return '后天'
        default:
          return date.replace(/[^(\w{2})$]/, '')
      }
      // let date = new Date()
      // this.
    },
    showInfo: function () {
      this.show = !this.show
    },
    dayToCode: function (val) {
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
  }
}
</script>
