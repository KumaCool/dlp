<template>
  <el-row class="login">
    <el-col :span="24">
      <el-form
               ref="form"
               :model="form"
               :rules="rules"
               label-width="80px"
               @keyup.enter.native="onSubmit('form')">
        <el-form-item prop="usercode" label="账号">
          <el-input v-model="form.usercode" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.checked">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
let log = console.log.bind(console)

/**
 * 获取cookie
 * @param  {string} name cookie名
 * @return {string}      返回匹配的cookie值
 */
function getCookie (name) {
  let arr = document.cookie.split('; ')
  for (var i = 0; i < arr.length; i++) {
    let temp = arr[i].split('=')
    if (temp[0] === name) return unescape(temp[1])
  }
}

export default {
  name: 'login',
  data () {
    return {
      form: {
        usercode: '',
        password: '',
        checked: ''
      },
      rules: {
        usercode: [{required: true, message: '帐号不能为空!'}],
        password: [{required: true, message: '密码不能为空!'}]
      }
    }
  },
  created () {
    this.ajax('/per/col/ac/get')
  },
  methods: {
    /**
     * 登录提交
     * @param  {string} formName 用于触发验证的表单数据名称
     */
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ajax('/sys/login', {
            method: 'post',
            params: this.form
          }, response => {
            // 记住密码
            if (this.form.checked) {
              let date = new Date()
              date.setTime(date.getTime() + 30 * 24 * 3.6e+6) // 30天
              document.cookie = `DSSESIONID=${escape(getCookie('DSSESIONID'))};expires=${date.toGMTString()}`
            }
            this.$message({message: response.rtnStr, type: 'success'})
            this.ajax('/per/col/ac/get')
          })
        } else return false
      })
    },
    /**
     * ajax简单的封装主要用于登录后拉取数据
     * @param  {string} url        请求地址
     * @param  {function} callback 回调,第一参数为ajax返回的数据
     */
    ajax: function (url, option = {}, callback) {
      option.url = url
      this.$http.request(option).then(response => {
        if (response.status !== 200) return this.$message({message: `页面错误: ${response.status}`, type: 'error'})
        if (response.data.rtnCode === 200 && callback === undefined) {
          this.$store.commit('set_state', {
            columnData: response.data.data.columnList,
            permission: response.data.data.permissionList
          })
        } else if (response.data.rtnCode === 200 && callback !== undefined) {
          callback(response.data)
        } else if (callback !== undefined) return this.$message({message: response.data.rtnStr, type: 'error'})
      }).catch(error => {
        this.$message({message: error, type: 'error'})
        log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  // .login {
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
</style>
