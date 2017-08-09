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
    created () { // 初始化加载栏目数据
      this.ajax('static/data/columens.json')
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
        this.ajax('static/data/columens.json', true)
      },
      /**
       * 请求栏目数据
       * @param  {string} url        请求地址
       * @param  {boolean} messageBox 是否显示提示
       */
      ajax: function (url, messageBox) {
        this.$http.get(url).then(response => {
          let result = response.data
          let msg = result.rtnStr
          let type = 'error'
          if (result.rtnCode === 200) {
            type = 'success'
            this.$store.commit('set_state', {columnData: result.data})
          }
          if (messageBox) this.$message({message: msg, type: type})
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
