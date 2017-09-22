<template>
  <el-row class="map" v-loading="loading">
    <el-col :id="id" :span="24"></el-col>
    <el-col :span="24">
<!--       <com-middle window="small"
                  name="repair"
                  title="报修"
                  class="map-repair"
                  :showTitle="0"
                  :zIndex="401"
                  @xxx="toPoint"></com-middle> -->
      <repair @to-point="toPoint"></repair>
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
    // 初始化地图
    this.map = new L.Map(this.id, {
      attributionControl: false
    }).setView([30.921775877611857, 117.77711665257813], 15)
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(this.map)

    this.bound = this.coordinateChange(this.map.getBounds()) // 获取当前地图范围

    let _self = this
    this.map.on('movestart', () => {
      _self.loading = true
    })
    this.map.on('moveend', function (e) {
      _self.bound = _self.coordinateChange(_self.map.getBounds())
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
      // log(e)
      // log(e.latlng.lng + ',' + e.latlng.lat)
      _self.toPoint(e.latlng)
    })
  },
  data () {
    return {
      loading: true, // 加载开关
      raw: 3857, // arcgis 坐标系
      geo: 4326, // geo 坐标系
      id: 'map', // 地图documentId
      map: '', // Map对象
      markers: L.markerClusterGroup({ // 初始化聚合对象
        disableClusteringAtZoom: 17,
        maxClusterRadius: 30, // 聚合距离
        spiderfyOnMaxZoom: false,
        chunkedLoading: true
      }),
      bound: [], // 可视边界
      data: [], // 数据
      layers: {}
      // layerGroup: L.layerGroup([]) // 图层
    }
  },
  methods: {
    // 根据地图范围获取数据
    /**
     * 获取地图数据
     * 默认根据可视范围以geoJson格式获取数据
     * @param  {string} dataName 保存本地时的命名
     * @param  {integer} dataId   API数据ID
     * @param  {object} params   API查询条件参数,默认条件为根据可视范围以geoJson格式获取
     * @return {promise}          数据保存后将返回promise对象
     */
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
          }
        }).then(resolve)
      })
    },
    /**
     * 图层生成与加载
     * @param  {string} dataName 被操作的数据名称
     * @param  {object} data      地图数据
     */
    layerData: function (layerName, dataName = layerName) {
      if (layerName === undefined) return this.$message({message: 'Map.layerData: 必须给图层起个名称', type: 'error'})
      this.markers.clearLayers()
      // this.layerGroup.clearLayers()
      let geoJsonOption = {
            pointToLayer: (geoJsonPoint, latlng) => L.circleMarker(latlng, {radius: 3, fillOpacity: 0.5})
            // .on('mouseover', () => log(this))
          },
          // 把数据转换成地图标记
          // geoJsonLayer =
          geoJsonLayer = this.data[dataName].map(v => {
            // log(v)
            return L.geoJson(v, geoJsonOption)
          }),
          // 转换成聚合
          markerCluster = this.markers.addLayers(geoJsonLayer)
          // _self = this
      this.$set(this.layers, layerName, L.layerGroup([]))
      this.layers[layerName].addLayer(markerCluster).addTo(this.map)
      this.loading = false
      // this.markers.clearLayers()
    },
    // 图层控制
    layerButton: function () {
      // let button = {
      //   '井盖': this.layerGroup
      // }
      L.control.layers('', this.layers, {
        collapsed: false
      }).addTo(this.map)
    },
    toPoint: function (point, layer, data) {
      log(data)
      // if (arguments[0])
      // point
      // this.map.panTo(point)
      // log(this.layers)
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
      this.getData('jing', 1).then(() => this.layerData('井盖', 'jing'))
    },
    layers (v) {
      // 载入图层控制按钮
      L.control.layers('', v, {
        collapsed: false
      }).addTo(this.map)
    }
  },
  components: {repair}
}
</script>
