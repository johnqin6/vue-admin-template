<template>
  <el-form class="login-form" ref="form"
    status-icon :rules="rules" :model="form">
    <el-form-item prop="username">
      <el-input
        v-model="form.username"
        auto-complete="off"
        placeholder="请输入用户名称">
        <i slot="prefix" class="iconfont icon-user"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        :type="passwordType"
        auto-complete="off"
        placeholder="请输入密码">
        <i slot="prefix" class="iconfont icon-mima"></i>
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPwd"></i>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked">记住账户</el-checkbox>
    <el-form-item>
      <el-button class="login-btn" type="primary" round>登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      checked: false,
      passwordType: 'password',
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 12, message: '用户名称长度2到12个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showPwd () {
      this.passwordType === 'password' ? (this.passwordType = 'text') : (this.passwordType = 'password')
    }
  }
}
</script>
<style scoped>
</style>
