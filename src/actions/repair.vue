<template>
  <el-row class="repair">
    <el-col :span="24">ddddd</el-col>
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
    this.notify()
  },
  data () {
    return {
      data: []
    }
  },
  watch: {
    data (v) {
      console.log(v)
      v.map(test => console.log())
      v.forEach(val => function () {
        console.log(val)
        this.$notify({
          title: '提示',
          message: '这是一条不会自动关闭的消息',
          customClass: 'repair-notify',
          duration: 0
        })
      })
    }
  },
  methods: {
    notify: function (title, message) {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        customClass: 'repair-notify',
        duration: 0
      })
    }
  }
}
</script>
