<template>
  <div id="map" ref="xxx"></div>
</template>
<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet'
// import E from 'esri-leaflet'
export default {
  mounted () {
    let tt = new L.Map('map', {
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
    }).setView([30.510597, 114.438742], 13)
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYTExMzcyMTA3MCIsImEiOiJjajZyYWFoZ3gwN2llMnByMTNydm5qbW5lIn0.PPYc3gIUiapIg1y1H7LOlQ').addTo(tt)
    // https://116.62.225.78:6443/arcgis/rest/services/hubei/MapServer
  },
  data () {
    return {
      id: 'map'
    }
  },
  methods: {
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
