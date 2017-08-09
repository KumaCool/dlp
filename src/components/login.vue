<template>
  <div class="login" v-if="check()">
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-input id="usercode" v-model="usercode" placeholder="请输入账号">
          <template slot="prepend">账号</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-input id="password" v-model="password" placeholder="请输入密码">
          <template slot="prepend">密码</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-button id="login" v-on:click="check" style="width:100%" type="primary">登录</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        usercode: '',
        password: ''
      }
    },
    methods: {
      check: function (event) {
        if (event !== undefined) {
          let usercode = this.usercode
          let password = this.password
          if (usercode === '' || password === '') {
            this.$message({
              message: '账号或密码为空！',
              type: 'error'
            })
            return
          }
          this.$http.get('static/test.json').then((response) => {
            this.tip = ''
            this.loginData = ''
            let result = response.data
            if (result.rtnCode === 200) {
              this.loginData = result.data.columns || {}
              console.log(this.loginData)
              this.$emit('check', this.loginData)
            } else {
              this.tip = result.rtnStr
              this.$alert(this.tip, '系统提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: `action: ${action}`
                  })
                }
              })
            }
          }, response => {
            this.tip = '登录失败！错误码：' + response.rtnCode
          })
        } else {
          this.$http.get('static/test1.json').then((response) => {
            this.columnData = ''
            let res = response.data
            if (res.rtnCode === 200) {
              this.columnData = res.data.columns || {}
              console.log(this.columnData)
              this.$emit('check', this.columnData)
            }
          })
          return true
        }
      }
    }
  }
</script>

<style lang="less">

  .login {
    width: 400px;
    height: 300px
  }

  .el-row {
    margin-top: 20px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

</style>
