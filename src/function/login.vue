<template>
  <div class="login">
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
        <el-button id="login" @click="submit" style="width:100%" type="primary">登录</el-button>
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
    created () {
      this.ajax('static/data/getUserPerColAcList.json')
    },
    methods: {
      submit: function () { // 登录
        if (this.usercode === '' || this.password === '') {
          this.$message({
            message: '账号或密码为空！',
            type: 'error'
          })
          return
        }
        this.ajax('static/data/login.json', response => {
          this.$message({message: response.rtnStr, type: 'success'})
          this.ajax('static/data/getUserPerColAcList.json')
        })
      },
      /**
       * ajax简单的封装主要用于登录后拉取数据
       * @param  {string} url        请求地址
       * @param  {function} callback 回调,第一参数为ajax返回的数据
       */
      ajax: function (url, callback) {
        this.$http.get(url).then(response => {
          if (response.data.rtnCode !== 200) return this.$message({message: response.data.rtnStr, type: 'error'})
          if (callback !== undefined) {
            callback(response.data)
          } else {
            this.$store.commit('set_state', {
              columnData: response.data.data.columnList,
              permission: response.data.data.permissionList
            })
          }
        }).catch(error => {
          this.$message({message: error, type: 'error'})
        })
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
