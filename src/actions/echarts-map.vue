<template>
  <div id="map" ref="xxx"></div>
</template>
<script>
import '../../node_modules/_mapbox-gl@0.39.1@mapbox-gl/dist/mapbox-gl.css'
import mapbox from 'mapbox-gl'
import echarts from 'echarts'

mapbox.accessToken = 'pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ'
export default {
  mounted () {
    /* eslint-disable */
    var myChart = echarts.init(document.getElementById('map'))
    console.log(myChart)
    myChart.setOption({
      xAxis: {},
      yAxis: {},
      mapbox: {
        center: [104.114129, 37.550339],
        zoom: 3,
        style: 'mapbox://styles/mapbox/dark-v9'
      }
    })
    /* eslint-enable */
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/css/less';
  #map{
    .W100;
    .H100;
    // overflow: hidden;
    // box-sizing: border-box;
    background: #333;
    color: red;
  }
</style>
