<template>
  <el-row v-if="daily.length > 0">
    <el-row class="weather-today">
      <el-col :span="6" class="weather-today-icon">图标</el-col>
      <el-col :span="18">今天<br>{{daily[0].low}}&#8451;&sim;{{daily[0].high}}&#8451;</el-col>
    </el-row>
    <el-row class="weather-info">
      <el-col></el-col>
    </el-row>
  </el-row>
</template>
<script>
let log = console.log.bind(console)

export default {
  created () {
    this.getData('/weather/daily.json', {start: 0, days: 3}).then(v => {
      this.daily = v.results[0].daily
      this.location = v.results[0].location
    })
  },
  data () {
    return {
      daily: [], // 每天天气数据
      location: {} // 本地基础数据
    }
  },
  computed: {
    now: function () {
      // log(this.daily.length >)
      if (this.daily.length > 0) return this.daily[0]
    }
  },
  methods: {
    /**
     * 获取数据
     * @param  {string} url    请求API
     * @param  {object} params API请求附带参数
     * @return {promise}        数据将以promise对象返回
     */
    getData: function (url, params) {
      if (url === undefined || url === '' || typeof params !== 'object') return this.$message({message: 'Weather.getData: 传入参数不正确', type: 'error'})
      let option = {
        baseURL: '/weather',
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
    }
  }
}
</script>
