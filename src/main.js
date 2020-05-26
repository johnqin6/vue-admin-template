import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局组件
import './components'
import http from './plugins/http'
// 挂载请求方法
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
