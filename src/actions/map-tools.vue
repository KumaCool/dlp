<template>
  <el-row class="map-tools">
    <el-col :span="24">
      <el-popover ref="weather"
                  placement="bottom"
                  width="200"
                  trigger="click"
                  content="有错误!有错误!有错误!">
        <weather class="weather"></weather>
<!--         <repair v-model="repair"
                @to-point="toPoint"
                @repair-switch="repairSwitch"></repair> -->
      </el-popover>
      <el-popover ref="repair"
                  placement="bottom"
                  trigger="click"
                  content="有错误!有错误!有错误!">
        <repair @to-point="toPoint"
                @repair-switch="repairSwitch"></repair>
      </el-popover>
      <el-button-group>
        <el-button>城市：铜陵</el-button>
        <el-button v-popover:weather>天气</el-button>
      </el-button-group>
      <el-badge :value="3"
                :max="99">
        <el-button v-popover:repair>报修</el-button>
      </el-badge>
    </el-col>
  </el-row> 
</template>
<script>
import repair from './repair'
import weather from './weather'
// let log = console.log.bind(console)
export default {
  created () {
    // let test = new WebSocket('ws://116.62.225.78:8380/pusher')
    // log(test.readyState)
    // test.onopen = function (evt) {
    //   log(evt)
    // }
    // log(test)
    // log(this.$store.state.socket)
    // let io = this.$store.state.socket
    // io.on('connect_error', (e) => {
    //   log(e)
    //   log('d')
    // })
  },
  methods: {
    toPoint: function () {
      this.$emit('to-point', arguments[0])
    },
    repairSwitch: function () {
      this.$emit('repair-switch', arguments[0])
    }
  },
  components: {repair, weather}
}
</script>
