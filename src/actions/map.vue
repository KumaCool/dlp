<template>
  <div id="map" ref="xxx"></div>
</template>
<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet'
import '../../node_modules/_leaflet.markercluster@1.1.0@leaflet.markercluster/dist/MarkerCluster.css'
import '../../node_modules/_leaflet.markercluster@1.1.0@leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

let log = console.log.bind(console)

// const raw = 3857, // 原空间参数
// const geo = 4326, // geoJson 空间参数
//       url = 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/1/query' // 数据API
export default {
  mounted () {
    // 初始化地图
    // map = new L.Map('map', {
    //   attributionControl: false
    // }).setView([30.93227, 117.80783], 18)
    this.map = new L.Map(this.id, {
      attributionControl: false
    }).setView([30.921775877611857, 117.77711665257813], 12)
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(this.map)

    this.bound = this.coordinateChange(this.map.getBounds()) // 获取当前地图范围

    // let _self = this
    this.map.on('moveend', function (e) {
      // _self.bound = _self.coordinateChange(_self.map.getBounds())
      // let moveBound = _self.coordinateChange(_self.map.getBounds())
      // /* eslint-disable */
      // if (
      //   moveBound[0][0] > _self.bound[0][0] ||
      //   moveBound[1][0] > _self.bound[1][0] ||
      //   moveBound[0][1] > _self.bound[0][1] ||
      //   moveBound[1][1] > _self.bound[1][1]
      // ) {
      //   _self.$set(_self, bound, moveBound)
      //   // _self.bound = moveBound
      //   log('move')
      // }
      // /* eslint-enable */
    })
    this.map.on('click', function (e) {
      log(e.latlng.lng + ',' + e.latlng.lat)
    })
  },
  data () {
    return {
      raw: 3857,
      geo: 4326,
      // url: 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/',
      id: 'map',
      map: '', // Map对象
      markers: L.markerClusterGroup({ // 初始化聚合对象
        disableClusteringAtZoom: 17,
        maxClusterRadius: 30, // 聚合距离
        spiderfyOnMaxZoom: false
      }),
      bound: [], // 可视边界
      data: [], // 数据
      layerGroup: L.layerGroup([]) // 图层
    }
  },
  computed: {
    // loadMarker: function () {
    //   this.data.forEach(v => {
    //     markers.addLayer(L.circleMarker(v, {radius: 3}))
    //   })
    //   map.addLayer(markers)
    //   return
    // }
  },
  methods: {
    // 根据地图范围获取数据
    getData: function (dataName, dataId, params) {
      if (dataName === undefined) return this.$message({message: 'Map.getData: 必须给数据起个名称', type: 'error'})
      if (!Number.isInteger(dataId)) return this.$message({message: 'Map.getData: 传入ID不正确', type: 'error'})
      let url = 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/' + dataId + '/query',
          option = {}
      option.params = params !== undefined ? params : {
        geometry: this.bound.map(v => v).toString(),
        geometryType: 'esriGeometryEnvelope',
        inSR: this.geo,
        f: 'geojson'
      }
      let _self = this
      return new Promise(function (resolve) {
        _self.$http.get(url, option).then(response => {
          if (response.status === 200) {
            _self.$set(_self.data, dataName, response.data.features)
            // _self.data = _self.dataForm(response.data.features)
          }
        }).then(resolve)
      })
    },
    // 格式式数据
    // dataForm: function (val) {
    //   let arr = []
    //   if (Array.isArray(val)) {
    //     // log(val)
    //     val.forEach(v => {
    //       if (v.geometry.coordinates !== undefined) {
    //         arr.push([
    //           v.geometry.coordinates[1],
    //           v.geometry.coordinates[0]
    //         ])
    //       }
    //     })
    //     return arr
    //   } else this.$message({message: '非数组!', type: 'error'})
    // },
    /**
     * 坐标翻转
     * 将传入的对象值前后颠倒并以数组形式返回
     * @param  {array|object} val 需要翻转的值
     * @return {array}     将以数组的形式返回
     */
    coordinateChange: function (val) {
      let arr = []
      if (Array.isArray(val) && val.length % 2 === 0) { // 数组类型转换
        for (var i = 0; i < val.length; i = i + 2) {
          arr.push(val[i + 1], val[i])
        }
      } else if (typeof val === 'object') { // 对象类型转换
        let tempArr = Object.keys(val).map(v => val[v])
        let length = tempArr.length
        if (length === 2 && val.lat !== undefined && val.lng !== undefined) {
          arr = tempArr.reverse()
        } else if (length > 1) {
          arr.push(...tempArr.map(v => this.coordinateChange(v)))
        }
      }
      return arr.length === 0 ? this.$message({message: '坐标参数的格式不正确!', type: 'error'}) : arr
    },
    // 点加工
    // 线加工
    // 加载数据
    // 生成图层数据
    layerData: function (layerName, data) {
      // this.markers.clearLayers()
      // this.layerGroup.clearLayers()
      let geoJsonOption = {
            pointToLayer: (geoJsonPoint, latlng) => L.circleMarker(latlng, {radius: 3, fillOpacity: 0.5})
          },
          // 把数据转换成地图标记
          // geoJsonLayer =
          geoJsonLayer = Object.keys(this.data).map(k => L.geoJson(this.data[k], geoJsonOption)),
          // 转换成聚合
          markerCluster = this.markers.addLayers(geoJsonLayer)
      this.layerGroup.addLayer(markerCluster).addTo(this.map)
      // 图层控制
      let button = {
        'jing': this.layerGroup
      }
      L.control.layers('', button, {
        collapsed: false
      }).addTo(this.map)
    }
    // 图层组管理
    // layerGroup
  },
  watch: {
    // data () {
    //   this.data.forEach(v => {
    //     markers.addLayer(L.circleMarker(v, {radius: 3}))
    //   })
    //   L.layerGroup().addLayer(markers).addTo(map)
    // },
    bound () {
      // 获取'井'数据
      this.getData('jing', 1).then(this.layerData)
    }
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
