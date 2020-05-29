import Vue from 'vue'
import VueRouter from 'vue-router'
import moduleRouter from './module'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index'),
    meta: {
      title: '登录',
      keepAlive: false, // 是否缓存组件
      isAuth: false // 是否控制查看权限
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'about'
    }
  },
  ...moduleRouter
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
