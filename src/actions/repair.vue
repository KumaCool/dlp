<template>
  <el-row class="repair">
    <el-col :span="24">
      <el-alert v-for="(v, index) in data"
                :key="index"
                :title="v.problemDesc"
                type="warning"
                show-icon
                @click.native="toPoint(index)"></el-alert>
      <!-- <el-button plain @click="notify">xxx</el-button> -->
    </el-col>
  </el-row>
</template>
<script>
export default {
  created () {
    this.$http.get('/inspect/repair').then(response => {
      if (response.data.rtnCode === 200) {
        // console.log(response.data.data.paginationList)
        this.data = response.data.data.paginationList
      }
    })
    // this.notify()
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    // 获取报修数据
    getData: function () {
      this.$http.get('/inspect/repair').then(response => {
        if (response.data.rtnCode === 200) {
          this.data = response.data.data.paginationList
        }
      })
    },
    /**
     * 触发父级组件跳转到地图相关坐标并删除该报修提示
     * @param  {integer} dataIndex [description]
     */
    toPoint: function (dataIndex) {
      if (dataIndex === undefined) return this.$message({message: 'Repair.toPoint: 必须是个整数', type: 'error'})
      let point = {
        lat: this.data[dataIndex].latitude,
        lng: this.data[dataIndex].longitude
      }
      this.$emit('to-point', point, this.data[dataIndex].problemType, this.data[dataIndex].fid)
      // this.data.splice(dataIndex, 1)
    }
  }
}
</script>
