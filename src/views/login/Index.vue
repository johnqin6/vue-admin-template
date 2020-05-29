<template>
  <div class="login-container">
    <div class="login-from-container">
      <h4 class="login-title">登录vue-admin</h4>
      <div class="login-body">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户密码" name="user">
            <user-login></user-login>
          </el-tab-pane>
          <el-tab-pane label="短信验证码" name="code">
            <user-code></user-code>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import userLogin from './UserLogin'
import userCode from './UserCode'

export default {
  data () {
    return {
      activeName: 'user'
    }
  },
  components: {
    userLogin,
    userCode
  }
}
</script>
<style lang="less">
.login-container {
  position: relative;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/login.png') no-repeat;
    background-size: cover;
    z-index: -999;
  }
  .login-from-container {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    padding: 20px 30px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 2px 0 0 #ccc;
    .login-title {
      margin: 0 0 20px;
      text-align: center;
      color: #409eff;
      letter-spacing: 3px;
    }
  }
  .login-form {
    width: 280px;
    padding: 10px 0;
    .login-btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
