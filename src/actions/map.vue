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
// let intervalId
export default {
  mounted () {
    // 初始化地图
    this.map = new L.Map(this.id, {
      attributionControl: false
    }).setView([30.921775877611857, 117.77711665257813], 12)
    L.tileLayer('https://api.mapbox.com/styles/v1/mayahw/cj7043o68chyg2ro3pzfy0qru/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF5YWh3IiwiYSI6IlhnVzlOb0EifQ.S_tK2JCpZMDshhJN5KNCYQ').addTo(this.map)

    // 初始化聚合层
    this.layerData('污水管点', 'blue')
    this.layerData('污水管线', 'green', 'line')

    // 获取当前地图范围
    this.bound = this.coordinateChange(this.map.getBounds())

    // 开启报修提示
    this.repairShow = true

    // 创建假按钮面板
    let jiance = {
          '积水点': this.falseData,
          '窨井': this.falseData,
          '井盖': this.falseData
        },
        jiankong = {
          '泵站': this.falseData
        },
        xuncha = {
          '积水点': this.falseData,
          '隐患': this.falseData,
          '违章': this.falseData
        }
    this.layerButton(jiance, 'jiance')
    this.layerButton(jiankong, 'jiankong')
    this.layerButton(xuncha, 'xuncha')

    let _self = this
    this.map.on('movestart', () => {
      // _self.loading = true
    })
    // 监听地图变动完成时触发
    this.map.on('moveend', e => {
      _self.bound = _self.coordinateChange(_self.map.getBounds())
    })
    // 监听点击事件
    this.map.on('click', e => {
      log(e.latlng.lng + ',' + e.latlng.lat)
    })
    // 图层控制按钮开启触发事件
    this.map.on('overlayadd', e => {
      let layerName = e.name.replace(/^<(.*)<\/i>/, '').replace('</div>', '')
      // 排除假按钮面板
      if (this.buttonTypes[layerName] === undefined) return this.$message({message: '没有数据'})
      let zoom = this.map.getZoom()
      this.$set(this.buttonTypes, layerName, true)
      this.layerButton(this.markers, 'basis')
      if (e.layer.layerType === 'line' && zoom < 16) {
        this.map.setZoom(16)
      } else if (e.layer.layerType === 'point' && zoom < 14) {
        this.map.setZoom(14)
      } else if (zoom >= 14) this.map.setZoom(zoom)
    })
    // 图层控制按钮关闭触发事件
    this.map.on('overlayremove', e => {
      let layerName = e.name.replace(/^<(.*)<\/i>/, '').replace('</div>', '')
      // 排除假按钮面板
      if (this.buttonTypes[layerName] === undefined) return this.$message({message: '没有数据'})
      this.$set(this.buttonTypes, layerName, false)
      this.layerButton(this.markers, 'basis')
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
      layers: {}, // 控制图层
      buttonTypes: {}, // 图层控制按钮状态
      falseData: L.layerGroup()
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
      // log('layerData')
      let dataName = layerName
      if (layerName === undefined) return this.$message({message: 'Map.layerData: 必须给图层起个名称', type: 'error'})
      // 如果没有真实数据就初始化一个
      if (this.data[dataName] === undefined) this.$set(this.data, dataName, [])
      // 如果没有真实数据就初始化一个
      if (this.buttonTypes[dataName] === undefined) this.$set(this.buttonTypes, dataName, false)
      // icon = L.icon()
      // 如果没有图层就初始化一个,否则就清空图层数据
      switch (type) {
        case 'line':
          if (this.markers[layerName] === undefined) {
            this.$set(this.markers, layerName, L.layerGroup().addTo(this.map))
          } else this.markers[layerName].clearLayers()
          this.data[dataName].forEach(v => {
            this.markers[layerName].addLayer(this.geoJsonChange(v, color))
          })
          // 给图层标注类型
          this.markers[layerName].layerType = type
          break
        case 'point':
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
          // 给图层标注类型
          this.markers[layerName].layerType = type
          break
      }

      // this.loading = false
    },
    /**
     * 生成报修提示图层
     * @param  {string} layerName 报修类型相关的图层名称
     */
    layerRepair: function (layerName) {
      // log('layerRepair')
      if (this.layers.repair === undefined) {
        this.$set(this.layers, 'repair', L.layerGroup())
        this.layers.repair.addTo(this.map)
      } else this.layers.repair.clearLayers()

      this.repair.forEach(v => {
        let point = L.latLng(v.latlng.split(',')), // 坐标 <<<<<<<< 要修改
            type = 'point', // 类型 <<<<<<<< 要修改
            // markers = this.markers[v.type].getLayers(),
            popupOption = {
              autoClose: false,
              closeOnClick: false
            }
        // 修改与报修数据相同的标记
        // if (markers.length > 0) {
        //   markers.forEach(mV => {
        //     if (this.isMarker(mV, point)) {
        //       mV.setStyle({color: 'red'})
        //     }
        //   })
        // }
        if (this.overBound(point) || !this.repairShow) return
        switch (type) {
          case 'point':
            let m = L.circleMarker(point, {radius: 3, color: 'red'})
                .bindPopup(v.problemDesc, popupOption)
                .on('click', () => {
                  this.toPoint(point)
                  this.layerRepair()
                })
                .on('popupclose', (e) => {
                  this.layers.repair.removeLayer(e.target)
                })
            this.layers.repair.addLayer(m)
            m.openPopup()
            break
        }
      })
    },
    layerIcon: function (option, size = [10, 10]) {
      option = typeof option === 'object' ? option : {
        iconUrl: option,
        iconSize: size
      }
      return L.icon(option)
    },
    /**
     * 监听报修面板开关
     * @param  {boolean} v 开关值
     */
    repairSwitch: function (v) {
      this.repairShow = !v
    },
    /**
     * 生成图层控制按钮面板
     * @param  {object} v 图层对象
     * @param  {string} buttonName 按钮面板名称
     */
    layerButton: function (v, buttonName) {
      // 载入图层控制按钮
      if (this.layers[buttonName] !== undefined) this.layers[buttonName].remove()
      let overlay = {},
          buttonIconClass = {
            '泵站': 'bengzhan',
            '泵站监控点': 'bengzhanjiankongdian',
            '合流管点': 'heliuguandian',
            '合流管线': 'heliuguanxian',
            '积水点': 'jishuidian',
            '积水监测点': 'jishuijiancedian',
            '积水巡查点': 'jishuixunchadian',
            '井盖': 'jinggai',
            '井盖监测点': 'jinggaijiancedian',
            '违章巡查点': 'weizhangxunchadian',
            '污水管点': 'wushuiguandian',
            '污水管线': 'wushuiguanxian',
            '窨井监测点': 'yinjingjiancedian',
            '隐患': 'yinhuan',
            '隐患巡查点': 'yinhuanxunchadian',
            '雨水管点': 'yushuiguandian',
            '雨水管线': 'yushuiguanxian'
          }
      Object.keys(v).forEach(k => {
        let active = ''
        if (this.buttonTypes[k]) active = 'layer-active'
        overlay[`<div class="layer-switch switch-icon ${active}"><i class="icon-switch-${buttonIconClass[k]}"></i>${k}</div>`] = v[k]
      })
      let layer = L.control.layers('', overlay, {collapsed: false}).addTo(this.map)
      this.$set(this.layers, buttonName, layer)
    },
    /**
     * 跳转到指定坐标点并触发该点图层
     * @param  {object|array} point     坐标值
     * @param  {string} layerName 所在图层集的名称
     * @param  {object} data      数据
     */
    toPoint: function (point, layerName, data) {
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
     * 判断坐标是否超出可视边界
     * @param  {object} point 坐标
     * @return {boolean}       超出返回true
     */
    overBound: function (point) {
      let bound = this.map.getBounds(),
          b1 = {lat: bound._northEast.lat, lng: bound._southWest.lng},
          b2 = {lat: bound._southWest.lat, lng: bound._northEast.lng}
      if (point.lat < b1.lat && point.lng < b1.lng) return true
      if (point.lat > bound._northEast.lat && point.lng < bound._northEast.lng) return true
      if (point.lat < bound._southWest.lat && point.lng > bound._southWest.lng) return true
      if (point.lat > b2.lat && point.lng > b2.lng) return true
      return false
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
          let marker = L.marker(L.latLng(geoJson.geometry.coordinates.reverse()), {icon: color}),
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
    // 根据地图变动更新数据
    bound (v) {
      // let zoom = this.map.getZoom()
      let pointJsonId = [1],
          lineJsonId = [5]

      Object.keys(this.buttonTypes).forEach(k => {
        // log(this.buttonTypes[k])
        if (this.buttonTypes[k] && this.markers[k].layerType === 'point') {
          // log('bound')
          pointJsonId.forEach(pV => {
            this.getData(pV, {outFields: 'EXP_NO,MAP_NO,ROAD,SUBSID'}).then(data => {
              this.$set(this.data, k, data.features)
            }).then(() => {
              let iconUrl = '../assets/images/icons/icon_map_switch_wushuiguandian.png'
              this.layerData(k, this.layerIcon(iconUrl))
            }).then(() => {
              this.layerRepair()
            })
          })
        } else if (this.buttonTypes[k] && this.markers[k].layerType === 'line') {
          lineJsonId.forEach(lV => {
            this.getData(lV).then(data => {
              this.$set(this.data, k, data.features)
            }).then(() => this.layerData(k, '#FCBCBC', 'line'))
          })
        } else this.map.removeLayer(this.markers[k])
      })
    },
    markers (v) {
      this.layerButton(v, 'basis')
    },
    repairShow (v) {
      if (!v) {
        this.layers.repair.clearLayers()
        // clearInterval(intervalId)
      } else {
        this.getData('/inspect/repair').then(data => {
          this.repair = data.data.paginationList
        }).then(() => this.layerRepair())
      }
      // if (!v) {
      //   this.layers.repair.clearLayers()
      //   clearInterval(intervalId)
      // } else {
      //   intervalId = setInterval(() => {
      //     this.getData('/inspect/repair').then(data => {
      //       this.repair = data.data.paginationList
      //     }).then(() => this.layerRepair('污水管点'))
      //   }, 1500)
      // }
    }
  },
  components: {repair}
}
</script>
