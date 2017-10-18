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
    <el-row>
      <el-col :span="24">
        <el-table :data="$store.getters.repairFormat"
                  border
                  style="width: 100%"
                  @row-click="toPoint">
          <el-table-column prop="problemType"
                           label="问题类型"
                           width="100"></el-table-column>
          <el-table-column prop="problemDesc"
                           label="问题描述"
                           width="180"></el-table-column>
          <el-table-column prop="submitPerson"
                           label="提交人"></el-table-column>
          <el-table-column prop="submitTime"
                           label="提交时间"
                           width="190"></el-table-column>
        </el-table>
<!--         <el-alert v-for="(v, index) in data"
                  :key="index"
                  :title="v.problemDesc"
                  type="warning"
                  show-icon
                  @click.native="toPoint(index)"></el-alert> -->
        <!-- <el-button plain @click="notify">xxx</el-button> -->
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  created () {
    this.$http.get('/inspect/repair').then(response => {
      if (response.status === 200) {
        this.$store.commit('set_state', {repair: response.data.data.paginationList})
      }
    })
  },
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
    toPoint: function (row) {
      // console.log(row)
      // if (dataIndex === undefined) return this.$message({message: 'Repair.toPoint: 必须是个整数', type: 'error'})
      // let point = this.value[dataIndex].latlng.split(',')
      // point.splice(2, point.length)
      this.$emit('to-point', row.latlng)
    },
    repairSwitch: function () {
      this.$emit('repair-switch', this.show)
    }
  }
}
</script>
