<template>
  <el-row v-if="today"
          :class="'weather-info-main weather-bg-' + weatherIcon(today.code_day)">
    <!-- 当日天气 -->
    <el-row class="weather-info-today"
            type="flex"
            justify="center">
      <el-col :span="10" :class="'weather-info-today-icon weather-icon-' + weatherIcon(today.code_day)"></el-col>
      <el-col :span="10">{{location.name}}<br><span>{{today.temperature}}&#8451;</span>{{today.text_day}}&nbsp;&nbsp;{{today.wind_direction}}</el-col>
    </el-row>
    <!-- 未来天气列表 -->
    <el-row class="weather-info-list">
      <el-col v-for="(v, index) in dayList"
              :key="index"
              :span="8">
        <span>{{dayCalc(index, v.date)}}</span>
        <span :class="'weather-icon weather-icon-' + weatherIcon(v.code_day)"></span>
        <span>{{v.low}}&#8451;/{{v.high}}&#8451;</span>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import {mapState} from 'vuex'

export default {
  beforeCreate () {
    this.$store.dispatch('weatherStore/weather')
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapState('weatherStore', [
      'location',
      'dayList',
      'today'
    ])
  },
  methods: {
    /**
     * 日期编码转换成相应Class名,用于图标样式的控制
     * @param  {integer} val 日期编码
     * @return {string}     返回相应的Class名称
     */
    weatherIcon: function (val) {
      if (!Number.isInteger(val)) return
      // 晴
      if (val <= 3) return 'sunny'
      // 多云
      if (val > 3 && val <= 8) return 'cloudy'
      // 阴
      if (val === 9) return 'overcast'
      // 阵雨
      if (val > 9 && val <= 12) return 'shower'
      // 雨与其它
      if (val > 12) return 'rain'
    },
    // 日期计算
    dayCalc: function (val, date) {
      switch (val) {
        case 0:
          return '明天'
        case 1:
          return '后天'
        default:
          return date
      }
    },
    // 天气面板控制
    showInfo: function () {
      this.show = !this.show
    }
  }
}
</script>
