<template>
  <el-row class="map" v-loading="loading">
    <el-col :id="id" :span="24"></el-col>
    <el-col :span="24">
      <repair v-model="repair"
              @to-point="toPoint"
              @repair-switch="repairSwitch"></repair>
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
let intervalId
export default {
  mounted () {
    // 初始化地图
    this.map = new L.Map(this.id, {
      attributionControl: false
    }).setView([30.921775877611857, 117.77711665257813], 12)
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(this.map)

    // 获取当前地图范围
    this.bound = this.coordinateChange(this.map.getBounds())

    // 初始化聚合层
    this.layerData('污水管点')
    this.layerData('污水管线')
    /* 
    //测试用，可删
    this.layerData('污水管线')
    this.layerData('污水管线')
    this.layerData('污水管线')
    this.layerData('污水管线')
    this.layerData('雨水管线')
    this.layerData('雨水管点')
    this.layerData('隐患巡查点')
    this.layerData('隐患')
    this.layerData('窨井监测点')
    this.layerData('违章巡查点')
    this.layerData('井盖监测点')
    this.layerData('井盖')
    this.layerData('积水巡查点')
    this.layerData('积水监测点')
    this.layerData('积水点')
    this.layerData('合流管线')
    this.layerData('合流管点')
    this.layerData('泵站监控点')
    this.layerData('泵站')
    */

    // 开启报修提示
    this.repairShow = true

    let _self = this
    this.map.on('movestart', () => {
      // _self.loading = true
    })
    // 监听地图变动完成时触发
    this.map.on('moveend', function (e) {
      _self.bound = _self.coordinateChange(_self.map.getBounds())
    })
    // 监听点击事件
    this.map.on('click', function (e) {
      log(e.latlng.lng + ',' + e.latlng.lat)
    })
    // 监听图层控制按钮的显示操作
    // this.map.on('overlayadd', () => {
    //   if (this.map.getZoom() < 14) this.map.setZoom(14)
    // })

    this.map.on('overlayadd', (e) => {
      log(arguments)
      // log('end')
    })
  },
  data () {
    return {
      loading: false, // 加载开关
      raw: 3857, // arcgis 坐标系
      geo: 4326, // geo 坐标系
      repair: [], // 报修数据
      repairShow: false, // 报修开关
      id: 'map', // 地图documentId
      map: '', // Map对象
      markers: {}, // 聚合图层集
      bound: [], // 可视边界
      data: [], // 真实数据
      layers: {} // 控制图层
    }
  },
  methods: {
    /**
     * 获取数据
     * @param  {string|array} url    <string>:为数据API地址,<array>:为地图数据apiId
     * @param  {object} params API请求附带参数
     * @return {promise}          数据将以promise对象返回
     */
    getData: function (url, params) {
      // this.loading = true
      if (url === undefined) return this.$message({message: 'Map.getData: URL不能为空', type: 'error'})
      let option = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
      if (Number.isInteger(url)) {
        url = 'https://116.62.225.78:6443/arcgis/rest/services/tongling/MapServer/' + url + '/query'
        option.params = {
          geometry: this.bound.map(v => v).toString(),
          geometryType: 'esriGeometryEnvelope',
          // outFields: 'Name,Strasse,权属单,探测时',
          inSR: this.geo,
          f: 'geojson',
          ...params
        }
      }
      let _self = this
      return new Promise(function (resolve) {
        _self.$http.get(url, option).then(response => {
          if (response.status === 200) {
            resolve(response.data)
          }
        })
      })
    },
    /**
     * 图层生成与加载
     * @param  {string} dataName 被操作的数据名称
     * @param  {object} data      地图数据
     */
    layerData: function (layerName, color = '#000', type = 'point') {
      let dataName = layerName
      if (layerName === undefined) return this.$message({message: 'Map.layerData: 必须给图层起个名称', type: 'error'})
      // 如果没有真实数据就初始化一个
      if (this.data[dataName] === undefined) this.$set(this.data, dataName, [])
      // 如果没有图层就初始化一个,否则就清空图层数据
      switch (type) {
        case 'line':
          log('line')
          if (this.markers[layerName] === undefined) {
            this.$set(this.markers, layerName, L.layerGroup().addTo(this.map))
          } else this.markers[layerName].clearLayers()
          this.data[dataName].forEach(v => {
            // log(v)
            this.markers[layerName].addLayer(this.geoJsonChange(v, color))
          })
          break
        case 'point':
          log('point')
          if (this.markers[layerName] === undefined) {
            this.$set(this.markers, layerName, L.markerClusterGroup({ // 初始化聚合对象
              disableClusteringAtZoom: 17,
              maxClusterRadius: 30, // 聚合距离
              spiderfyOnMaxZoom: false,
              chunkedLoading: true
            }))
          } else this.markers[layerName].clearLayers()
          let arrMarker = this.data[dataName].map(v => this.geoJsonChange(v, color))
          this.markers[layerName].addLayers(arrMarker).addTo(this.map)
          break
      }

      // this.loading = false
    },
    /**
     * 生成报修提示图层
     * @param  {string} layerName 报修类型相关的图层名称
     */
    layerRepair: function (layerName) {
      if (this.layers.repair === undefined) {
        this.$set(this.layers, 'repair', L.layerGroup())
        this.layers.repair.addTo(this.map)
      } else this.layers.repair.clearLayers()
      this.repair.forEach(v => {
        let point = L.latLng([v.latitude, v.longitude]),
            bool = false,
            option = {radius: 3, color: 'red'}
        if (this.markers[layerName].getLayers().length > 0) {
          let markerArr = this.markers[layerName].getLayers()
          bool = markerArr.some(mV => {
            if (this.isMarker(mV, point)) {
              option = {radius: 0, stroke: false}
              mV.setStyle({color: 'red'})
              return true
            }
          })
        } else bool = true
        if (bool) {
          let m = L.circleMarker(point, option)
                   .bindPopup(v.problemDesc, {autoClose: false, closeOnClick: false})
                   .on('click', () => this.toPoint(point))
          this.layers.repair.addLayer(m)
          m.openPopup()
        }
      })
    },
    /**
     * 监听报修面板开关
     * @param  {boolean} v 开关值
     */
    repairSwitch: function (v) {
      this.repairShow = !v
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
      // log('1')
      point = L.latLng(point)
      this.map.setView(point, 18)
    },
    /**
     * 判断图层是否属于该坐标
     * @param  {object}  marker 图层
     * @param  {object}  point 坐标
     * @return {bolean}       如果是就返回真
     */
    isMarker: function (marker, point) {
      let l = marker.getLatLng()
      return l.lat === point.lat && l.lng === point.lng
    },
    /**
     * 根据坐标查询匹配的数据
     * @param  {object} [geoJson={}] 要查询的数据
     * @param  {object|Array} point        坐标
     * @return {object}              返回匹配的数据
     */
    markerEach: function (markers, point) {
      point = L.latLng(point)
      let m
      markers.some(v => {
        m = v
        return this.isMarker(v, point)
      })
      if (m !== undefined) return m
    },
    /**
     * geoJson转换成图层数据
     * @param  {object} geoJson geoJson数据
     * @return {object}         返回对应的图层类型数据
     */
    geoJsonChange: function (geoJson, color) {
      if (geoJson.geometry === undefined) return this.$message({message: 'Map.geoJsonChange: geoJson格式不正确', type: 'error'})
      switch (geoJson.geometry.type) {
        case 'Point':
          let marker = L.circleMarker(L.latLng(geoJson.geometry.coordinates.reverse()), {radius: 3, color: color}),
              tip = Object.keys(geoJson.properties).map(k => k + '：' + geoJson.properties[k])
          marker.bindTooltip(tip.join('<br>'))
          return marker
        case 'LineString':
          geoJson.geometry.coordinates.map(v => v.reverse())
          let polyline = L.polyline(geoJson.geometry.coordinates, {color: color})
          return polyline
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
  },
  watch: {
    bound (v) {
      if (this.map.getZoom() >= 16) {
        this.getData(5).then(data => {
          this.$set(this.data, '管线', data.features)
        }).then(() => this.layerData('管线', 'green', 'line'))
      } else if (this.map.getZoom() >= 14) {
        // 获取'井盖'数据
        this.getData(1, {outFields: 'EXP_NO,MAP_NO,ROAD,SUBSID'}).then(data => {
          this.$set(this.data, '污水管点', data.features)
        }).then(() => this.layerData('污水管点', 'blue'))
        // 清除聚合图层
        // Object.keys(this.markers).map(k => this.map.removeLayer(this.markers[k]))
      } else {
        // 清除聚合图层
        Object.keys(this.markers).map(k => this.map.removeLayer(this.markers[k]))
        // 清除报修提示图层
        // if (this.layers.repair !== undefined) this.layers.repair.clearLayers()
      }
      // 清除聚合图层
      // Object.keys(this.markers).map(k => this.map.removeLayer(this.markers[k]))
    },
    markers (v) {
      // 载入图层控制按钮
      if (this.layers.button !== undefined) this.layers.button.remove()
      let test = {}
      Object.keys(v).forEach(k => {
        let xxxx = ''
        if (k === '泵站') xxxx = 'bengzhan'
        if (k === '泵站监控点') xxxx = 'bengzhanjiankongdian'
        if (k === '合流管点') xxxx = 'heliuguandian'
        if (k === '合流管线') xxxx = 'heliuguanxian'
        if (k === '积水点') xxxx = 'jishuidian'
        if (k === '积水监测点') xxxx = 'jishuijiancedian'
        if (k === '积水巡查点') xxxx = 'jishuixunchadian'
        if (k === '井盖') xxxx = 'jinggai'
        if (k === '井盖监测点') xxxx = 'jinggaijiancedian'
        if (k === '违章巡查点') xxxx = 'weizhangxunchadian'
        if (k === '污水管点') xxxx = 'wushuiguandian'
        if (k === '污水管线') xxxx = 'wushuiguanxian'
        if (k === '窨井监测点') xxxx = 'yinjingjiancedian'
        if (k === '隐患') xxxx = 'yinhuan'
        if (k === '隐患巡查点') xxxx = 'yinhuanxunchadian'
        if (k === '雨水管点') xxxx = 'yushuiguandian'
        if (k === '雨水管线') xxxx = 'yushuiguanxian'
        test['<i class="icon-switch-' + xxxx + ' switch-icon"></i> ' + k] = v[k]
      })
      let layer = L.control.layers('', test, {collapsed: false}).addTo(this.map)
      this.$set(this.layers, 'button', layer)
    },
    repairShow (v) {
      if (!v) {
        this.layers.repair.clearLayers()
        clearInterval(intervalId)
      } else {
        intervalId = setInterval(() => {
          this.getData('/inspect/repair').then(data => {
            this.repair = data.data.paginationList
          }).then(() => this.layerRepair('污水管点'))
        }, 1500)
      }
    }
  },
  components: {repair}
}
</script>
