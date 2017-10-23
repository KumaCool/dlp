<template>
  <el-row class="login">
    <el-col :span="24">
      <el-form
               ref="form"
               :model="form"
               :rules="rules"
               label-width="80px"
               @keyup.enter.native="onSubmit">
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
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
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
    // this.ajax('/per/col/ac/get')
  },
  methods: {
    /**
     * 登录提交
     * @param  {string} formName 用于触发验证的表单数据名称
     */
    onSubmit: function () {
      // console.log(this)
      this.$store.dispatch('loginStore/login', this.form)
    }
  }
}
</script>
<style lang="less">
  @import '../assets/css/style';
  @import '../assets/css/DLPlatform';
</style>
