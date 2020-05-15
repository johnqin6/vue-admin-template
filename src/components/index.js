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
  console.log(component)
  Vue.component(component.name, component)
})
