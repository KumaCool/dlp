<template>
  <el-row class="map" v-loading="loading">
    <el-col :id="id" :span="24"></el-col>
    <el-col :span="24">
      <repair @to-point="toPoint" v-model="repair"></repair>
    </el-col>
  </el-row>
</template>
<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet'
import '../../node_modules/_leaflet.markercluster@1.1.0@leaflet.markercluster/dist/MarkerCluster.css'
import '../../node_modules/_leaflet.markercluster@1.1.0@leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import repair from './repair'

let log = console.log.bind(console)

export default {
  mounted () {
    // 获取报修数据
    this.getData('/inspect/repair').then(data => {
      this.repair = data.data.paginationList
    }).then(() => {
      this.markerList.map(v => {
        log(v)
      })
    })
    // 初始化地图
    this.map = new L.Map(this.id, {
      attributionControl: false
    }).setView([30.921775877611857, 117.77711665257813], 13)
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(this.map)

    this.bound = this.coordinateChange(this.map.getBounds()) // 获取当前地图范围

    let _self = this
    this.map.on('movestart', () => {
      _self.loading = true
    })
    this.map.on('moveend', function (e) {
      _self.bound = _self.coordinateChange(_self.map.getBounds())
    })
    this.map.on('click', function (e) {
      // log(e)
      log(e.latlng.lng + ',' + e.latlng.lat)
      _self.toPoint(e.latlng)
    })
  },
  data () {
    return {
      loading: true, // 加载开关
      raw: 3857, // arcgis 坐标系
      geo: 4326, // geo 坐标系
      repair: [], // 报修数据
      id: 'map', // 地图documentId
      map: '', // Map对象
      markers: {}, // 聚合图层集
      bound: [], // 可视边界
      data: [], // 数据
      layers: {},
      markerList: []
      // layerGroup: L.layerGroup([]) // 图层
    }
  },
  methods: {
    /**
     * 获取数据
     * @param  {string|array} url    <string>:为数据API地址,<array>:为地图数据apiId
     * @param  {object} params API请求附带参数
     * @return {promise}          数据保存后将返回promise对象
     */
    getData: function (url, params) {
      if (url === undefined) return this.$message({message: 'Map.getData: URL不能为空', type: 'error'})
      let option = {}
      if (Number.isInteger(url)) {
        url = 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/' + url + '/query'
        option.params = params !== undefined ? params : {
          geometry: this.bound.map(v => v).toString(),
          geometryType: 'esriGeometryEnvelope',
          inSR: this.geo,
          f: 'geojson'
        }
      }
      let _self = this
      return new Promise(function (resolve) {
        _self.$http.get(url, option).then(response => {
          if (response.status === 200) {
            resolve(response.data)
            // _self.$set(_self.data, dataName, response.data.features)
          }
        }) // .then(resolve)
      })
    },
    /**
     * 图层生成与加载
     * @param  {string} dataName 被操作的数据名称
     * @param  {object} data      地图数据
     */
    layerData: function (layerName, dataName = layerName) {
      if (layerName === undefined) return this.$message({message: 'Map.layerData: 必须给图层起个名称', type: 'error'})
      if (this.markers[layerName] === undefined) {
        this.$set(this.markers, layerName, L.markerClusterGroup({ // 初始化聚合对象
          disableClusteringAtZoom: 17,
          maxClusterRadius: 30, // 聚合距离
          spiderfyOnMaxZoom: false,
          chunkedLoading: true
        }))
        this.$set(this.markerList, layerName, [])
      } else this.markers[layerName].clearLayers()
      this.data[dataName].map(v => {
        let m = this.geoJsonChange(v)
        // if (this.repair.length > 0) {
        //   this.repair.map(rV => {
        //     if (isLayer(m, L.latLng(rV.longitude, rV.latitude)))
        //   })
        // }
        // log()
        // m.setTooltipContent('qqq').openTooltip()
        this.markers[layerName].addLayer(m)
        // this.markers.openTooltip(m.getLatLng())
        this.markerList[layerName].push(m)
      })
      this.markers[layerName]
      this.map.addLayer(this.markers[layerName])
      this.loading = false
    },
    // 图层控制
    layerButton: function () {
      L.control.layers('', this.layers, {
        collapsed: false
      }).addTo(this.map)
    },
    /**
     * 跳转到指定坐标点并触发该点图层
     * @param  {object|array} point     坐标值
     * @param  {string} layerName 所在图层集的名称
     * @param  {object} data      数据
     */
    toPoint: function (point, layerName, data) {
      layerName = '井盖'
      let geoJson = this.geoJsonEach(this.data[layerName], point)
      this.map.setView(point, 18)
      let layer = this.geoJsonChange(geoJson)
      this.map.addLayer(layer)
      layer.openTooltip(L.latLng(geoJson.geometry.coordinates.reverse()))
    },
    isLayer: function (layer, point) {
      return layer.getLatLng() === L.latLng(point)
    },
    // layerEach: function (layer, po)
    /**
     * 根据坐标查询匹配的数据
     * @param  {object} [geoJson={}] 要查询的数据
     * @param  {object|Array} point        坐标
     * @return {object}              返回匹配的数据
     */
    geoJsonEach: function (geoJson = {}, point) {
      if (Array.isArray(geoJson) && geoJson[0].geometry === undefined) return this.$message({message: 'Map.geoJsonChange: geoJson格式不正确', type: 'error'})
      // if (typeof point === 'object') point = [point.lng, point.lat]
      point = L.latLng(point)
      let temp
      geoJson.some(v => {
        temp = v
        if (L.latLng(v.geometry.coordinates) === point) return true
      })
      return temp
    },
    /**
     * geoJson转换成图层数据
     * @param  {object} geoJson geoJson数据
     * @return {object}         返回对应的图层类型数据
     */
    geoJsonChange: function (geoJson) {
      if (geoJson.geometry === undefined) return this.$message({message: 'Map.geoJsonChange: geoJson格式不正确', type: 'error'})
      switch (geoJson.geometry.type) {
        case 'Point':
          let marker = L.circleMarker(L.latLng(geoJson.geometry.coordinates.reverse()), {radius: 3})
          if (geoJson.properties.Name !== undefined) marker.bindTooltip(geoJson.properties.Name)
          return marker
      }
    },
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
    }
    // 点加工
    // 线加工
    // 加载数据
    // 图层组管理
    // layerGroup
  },
  watch: {
    bound () {
      // 获取'井盖'数据
      // this.getData('井盖', 1).then(() => this.layerData('井盖'))
      this.getData(1).then(data => {
        this.$set(this.data, '井盖', data.features)
      }).then(() => this.layerData('井盖'))
    },
    markers (v) {
      // 载入图层控制按钮
      L.control.layers('', v, {
        collapsed: false
      }).addTo(this.map)
    }
  },
  components: {repair}
}
</script>
