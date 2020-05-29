import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import './assets/iconfont/icon.css' // 引入字体图标库

// 引入全局组件
import './components'
import http from './plugins/http'
// 挂载请求方法
Vue.prototype.$http = http

Vue.use(ElementUI)

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  const userInfo = localStorage.getItem('userInfo') || null
  if (!userInfo && to.meta.auth) {
    next('/login')
  } else {
    next()
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
