<template>
  <el-form class="login" ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item prop="usercode" label="账号"><el-input v-model="form.usercode" placeholder="请输入账号"></el-input></el-form-item>
    <el-form-item prop="password" label="密码"><el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input></el-form-item>
    <el-form-item><el-button type="primary" @click="onSubmit('form')">登录</el-button></el-form-item>
  </el-form>
</template>

<script>
  let log = console.log.bind(console)
  export default {
    name: 'login',
    data () {
      return {
        form: {
          usercode: '',
          password: ''
        },
        rules: {
          usercode: [{required: true, message: '帐号不能为空!'}],
          password: [{required: true, message: '密码不能为空!'}]
        }
      }
    },
    created () {
      this.ajax('/sys/getUserPerColAcList.json')
    },
    methods: {
      /**
       * 登录提交
       * @param  {string} formName 用于触发验证的表单数据名称
       */
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajax('/sys/login.json', {
              method: 'post',
              params: this.form
            }, response => {
              this.$message({message: response.rtnStr, type: 'success'})
              this.ajax('/sys/getUserPerColAcList.json')
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
          log(response)
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
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
