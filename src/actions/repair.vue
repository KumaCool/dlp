<template>
  <el-row class="repair">
    <el-row>
      <el-col :span="24">
        <el-switch v-model="show"
                   :width="100"
                   on-text="报修开启"
                   off-text="报修关闭"
                   on-color="#13CE66"
                   off-color="#CCC"
                   @click.native="repairSwitch">
        </el-switch>
      </el-col>
    </el-row>
    <el-row v-show="show">
      <el-col :span="24">
        <el-alert v-for="(v, index) in value"
                  :key="index"
                  :title="v.problemDesc"
                  type="warning"
                  show-icon
                  @click.native="toPoint(index)"></el-alert>
        <!-- <el-button plain @click="notify">xxx</el-button> -->
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
      show: true
    }
  },
  methods: {
    /**
     * 触发父级组件跳转到地图相关坐标并删除该报修提示
     * @param  {integer} dataIndex 数据下标
     */
    toPoint: function (dataIndex) {
      if (dataIndex === undefined) return this.$message({message: 'Repair.toPoint: 必须是个整数', type: 'error'})
      let point = {
        lat: this.value[dataIndex].latitude,
        lng: this.value[dataIndex].longitude
      }
      this.$emit('to-point', point, this.value[dataIndex].type, this.value[dataIndex].problemDesc)
    },
    repairSwitch: function () {
      this.$emit('repair-switch', this.show)
    }
  }
}
</script>
