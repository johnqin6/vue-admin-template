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
