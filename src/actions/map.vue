<template>
  <div id="map" ref="xxx"></div>
</template>
<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet'
let log = console.log.bind(console)
// import E from 'esri-leaflet'
export default {
  mounted () {
    let map = new L.Map('map', {
      // zoom: 13,
      // center: [51.505, -0.09],
      // marker: [51.500, 0.00],
      // minZoom: 8,
      // maxZoom: 15,
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution: 'vue-leaflet',
      // title: 'vue-leaflet',
      // opacity: 1,
      // draggable: true,
      attributionControl: false
    }).setView([30.93227, 117.80783], 13)
    // 铜陵经纬度
    // -----
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(map)
    // https://116.62.225.78:6443/arcgis/rest/services/hubei/MapServer
    let p1 = L.point(30, 114)
    map.panBy(p1)
    // L.marker(p1).addTo(map);
    // L.circle([30.924275923002877, 117.78546033639891], {radius: 200}).addTo(map)
    L.circleMarker([30.924275923002877, 117.78546033639891], {radius: 5}).addTo(map)
    log(map.getBounds()) // 获取当前地图范围
    map.on('click', function (e) {
      log(e.latlng.toString())
    })

    // let data
    let url = 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/1/query?where=FID+%3E+0&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
    this.$http.get(url).then(response => {
      // log(response)
      let data = this.dataForm(response.data.features)
      data.forEach(v => {
        L.circleMarker(v, {radius: 5}).addTo(map)
      })
    })
    // log(data)
  },
  data () {
    return {
      id: 'map'
    }
  },
  methods: {
    // 根据地图范围获取数据
    dataForm: function (val) {
      let arr = []
      if (Array.isArray(val)) {
        // log(val)
        val.forEach(v => {
          if (v.geometry.coordinates !== undefined) {
            arr.push([
              v.geometry.coordinates[1],
              v.geometry.coordinates[0]
            ])
          }
        })
        return arr
      } else log('非数组')
    }
    // 点加工
    // 线加工
    // 加载数据
    // 图层操作
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
