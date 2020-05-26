# vue-admin-template

## 简介

vue后台管理项目模板

## 项目运行
- 安装依赖
> npm i | cnpm i | yarn      
- 本地运行   
> npm serve | yarn serve    
- 生产打包   
> npm run build | yarn run build   
- eslint 检查并修复
> npm run lint     

## 相关知识点
------
- [x] [全局注册组件](#全局注册组件)  
- [x] [模块化路由](#模块化路由)
- [x] [axios封装](#axios封装)

### 全局注册组件

1、首先在`components`文件夹下新建一个`common`文件夹，用于放置全局的组件。
其中每一个全局组件里边需要新建一个`index.js`，用于引入组件并导出组件对象。   
```javascript
// components/common/xxx/index.js
// 1. 单个组件引入并导出
import qtButton from './qtButton'
export default qtButton

// 2. 多个组件引入并导出
import component1 from './component1'
import component2 from './component1'
export {
  component1,
  component2
}
```

文件结构如下：   
[全局组件结构](./static/images/global_components.png)  

2、在components文件夹下新建一个index.js文件, 用于自动扫描全局组件并注册    
```javascript
// components/index.js
import Vue from 'vue'

// 自动加载common 目录下的.js结尾的文件
const componentsContext = require.context('./common', true, /\.js$/)

const components = []
// 自动注册全局组件
componentsContext.keys().forEach(module => {
  const moduleConfig = componentsContext(module)

  // 判断组件是否默认暴露（即有只有一个组件)
  if (!moduleConfig.default) { // 多个组件时
    Object.values(moduleConfig).forEach(component => {
      components.push(component)
    })
  } else { // 单个组件
    components.push(moduleConfig.default)
  }
})

components.forEach(component => {
  Vue.component(component.name, component)
})
```   

3、在入口文件main.js引入`components\index`文件   
```javascript
import './components'
```    
此时就可以愉快的在页面使用全局组件了。   

### 模块化路由
在vue中使用路由每次新增一个页面，就需要到路由配置中配置该页面的信息，当页面比较多时，
路由配置文件就会变得比较臃肿，那么如何将路由变得简洁方便呢?  

这里有两种方法来配置路由   

#### 1. 在router文件夹中拆分路由   
1、首先根据不同业务模块拆分路由, 具体做法：    
  - 在router文件里新建module文件夹
  - 在module文件夹里新建不同业务模块的文件夹并新建routes.js文件
  - 在不同业务模块的routes.js文件里配置相关路由并导出
2、最后在router文件夹下的自动扫描获取各个模块的路由配置并注册    

具体代码示例： 
1. 各模块路由配置    
```javascript
// router/module/news/routes.js
export default [
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/module/news/News.vue')
  }
]
```  

2. 自动扫描获取各模块路由配置   
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
const getChunks = (modulesContext) => {
  const chunks = modulesContext.keys().reduce((modules, key) => {
    modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
    return modules
  }, {})

  return chunks
}

const routes = []

const routerContexts = [
  require.context('@/router/module', true, /.routes.js$/)
]

routerContexts.forEach(routerContext => {
  const routerChunks = getChunks(routerContext)

  Object.keys(routerChunks).forEach(item => {
    routes.push(...routerChunks[item])
  })
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```  

#### 2. 在视图模块中配置路由  
除了在路由中拆分路由，还可以在视图模块中配置路由，这样使用编写页面时更方便    

1、第一步和在路由中拆分路由差不多，在视图模块中新建一个routes.js   
```javascript
// views/module/news/routes.js
export default [
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/module/news/News.vue')
  }
]
```    

2、自动扫描路由配置也相似，只是扫描的地址换一下    
```javascript
// ...

const routerContexts = [
  require.context('@/views/module', true, /.routes.js$/)
]

// ...
```

### axios封装
- 安装axios  
> npm i axios --save | yarn add axios   

#### 1. 配置不同的环境  
在根目录新建三个环境变量文件，`.env,.env.test,.env.prod`分别表示开发环境，测试环境，正式环境。
然后在不同文件中配置不同的api地址。  
```C
# // .env
NODE_ENV = "development"
BASE_URL = "https://www.fastmock.site/mock/d455fc8eb2ebedb0a2492b023ec4ac85/api"
```  
为了本地开发调试，可以配置跨域代理   
1. 新建vue.config.js文件（该文件是项目的配置文件,可以进行webpack配置）   
```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const baseApi = process.env.BASE_URL

module.exports = {
  configureWebpack: (config) => {
    // 分析打包体积
    if (process.env.IS_ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    https: false,
    open: false,
    // 配置多个代理
    proxy: {
      '/api': {
        target: baseApi,
        ws: true,
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
```

#### 2. 封装axios
新建plugins文件夹，在其下新建http.js文件
```javascript
import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'

const service = axios.create({
  timeout: 6000, // 设置超时时间
  baseURL: process.env.BASE_URL
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截
 * 用于处理需要在请求前的操作
 */
const loading = null
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // 获取存储的token
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(response => {
  const responseCode = response.status
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (responseCode === 200) {
    return Promise.resolve(response.data)
  } else {
    return Promise.reject(response)
  }
}, error => {
  // 请求响应后关闭加载框
  if (loading) {
    loading.close()
  }

  // 断网 或者 请求超时 状态
  if (!error.response) {
    if (error.message.includes('timeout')) { // 请求超时状态
      console.log('超时了')
      Message.error('请求超时，请检查网络是否连接正常')
    } else { // 展示断网组件
      console.log('断网了')
      Message.error('请求失败，请检查网络是否已连接')
    }
    return false
  }
  // 服务器返回不是 2 开头的情况，会进入这个回调
  // 可以根据后端返回的状态码进行不同的操作
  const responseCode = error.response.status

  switch (responseCode) {
    // 401：未登录
    case 401:
      // 跳转登录页
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      break
    // 403: token过期
    case 403:
      // 弹出错误信息
      Message({
        type: 'error',
        message: '登录信息过期，请重新登录'
      })
      // 清楚token
      localStorage.removeItem('token')
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }, 1000)
      break
    // 404 请求不存在
    case 404:
      Message({
        message: '网络请求不存在',
        type: 'error'
      })
      break
    // 其他错误，直接抛出错误提示
    default:
      Message({
        message: error.response.data.message,
        type: 'error'
      })
  }
  return Promise.reject(error)
})

// 封装get方法
const get = (url, data) => {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: data
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 封装post方法
const post = (url, data) => {
  return new Promise((resolve, reject) => {
    service.get(url, data).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 上传文件数据
 * @param {Object} formData
 */
const uploadFile = async formData => {
  const res = await service.request({
    method: 'post',
    url: '/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res
}

service.prototype.get = get
service.prototype.post = post
service.prototype.uploadFile = uploadFile

export default service
```
