<template>
  <el-form class="login-form" ref="form"
    status-icon :rules="rules" :model="form">
    <el-form-item prop="phone">
      <el-input
        v-model="form.phone"
        auto-complete="off"
        placeholder="请输入手机号码">
        <i slot="prefix" class="iconfont icon-shouji"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="form.code"
        auto-complete="off"
        placeholder="请输入验证码">
        <i slot="prefix" class="iconfont icon-yanzhengma icon-code"></i>
        <template slot="append">
          <span @click="sendCodeTime">{{msgText}}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="login-btn" type="primary" round>登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { isvalidatemobile } from '@/utils/validate'
const MSGINIT = '发送验证码'
// const MSGSUCCESS = '${time}秒后重发'
const MSGTIME = 60
export default {
  data () {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value).result) {
        callback(new Error(isvalidatemobile(value).msg))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位数的验证码'))
      } else {
        callback()
      }
    }
    return {
      form: {
        phone: '',
        code: ''
      },
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      msgText: MSGINIT,
      msgTime: MSGTIME,
      msgKey: false
    }
  },
  methods: {
    sendCodeTime () {
      if (this.msgKey) return false
      this.msgText = `${this.msgTime}秒后重发`
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        this.msgText = `${this.msgTime}秒后重发`
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME
          this.msgText = MSGINIT
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
    }
  }
}
</script>
<style scoped>
.icon-code {
  position: relative;
  top: 10px;
}
</style>
