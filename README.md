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

