/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-08-14 09:28:41
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-05-11 09:24:21
 */

import axios from 'axios'
// import QS from 'qs'
import { Message } from 'element-ui'
import store from '@/store/index'

// 设置请求头
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

// 请求超时时间
axios.defaults.timeout = 20000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 打开加载遮罩
    if (!(config.url === '/SearchCase/xxx')) {
      store.dispatch({ type: 'app/changeLoadingStatus', amount: false })
    }
    // 在http请求的header都加上token
    const token = store.state.app.token || window.localStorage.getItem('token')
    config.headers.token = token
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 关闭加载遮罩
    if (!(response.config.url === '/SearchCase/xxx')) {
      store.dispatch({ type: 'app/changeLoadingStatus', amount: false })
    }
    // 未登录状态跳转登录页
    // if (response.data.code === 10) {
    //   Message({ type: 'info', message: '10 未登录！', duration: 5000 })
    // }
    return Promise.resolve(response)
  },
  error => {
    // 关闭加载遮罩
    store.dispatch({ type: 'app/changeLoadingStatus', amount: false })
    if (error.status === 500) {
      Message({ type: 'error', message: '500 内部服务器错误！', duration: 5000 })
    }
    if (error.status === 404) {
      Message({ type: 'error', message: '404 接口不存在', duration: 5000 })
    }
    return Promise.reject(error.response)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export let get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export let post = (url, params, responseType) => {
  return new Promise((resolve, reject) => {
    axios({ method: 'post', url: url, data: params, responseType: responseType || 'json' })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * all方法，对应all请求
 * @param {List} queryList [多个请求的url地址和参数的集合]
 */
export let all = (queryList) => {
  let query = queryList.map((item) => {
    return axios.get(item.url, { params: item.params })
  })
  return new Promise((resolve, reject) => {
    axios.all(query)
      .then((iterable) => {
        resolve(iterable)
      }).catch(err => {
        reject(err.data)
      })
  })
}
