// header公共组件状态库
import { loginStatus, logout } from '@/api/api.js'
import router from '@/router'

const state = {
  // 是否登录状态
  ifLogin: false,
  // 搜索框内容
  searchVal: '',
  // 搜索类型
  searchType: 'mediateCase'
}

// mutations
const mutations = {
  changeLogin (state, status) {
    state.ifLogin = status
  },
  changeSearchVal (state, status) {
    state.searchVal = status
  },
  changeSearchType (state, status) {
    state.searchType = status
  }
}
const actions = {
  // 判断是否登录
  changeLoginAsync ({commit}) {
    return new Promise((resolve, reject) => {
      loginStatus().then((res) => {
        if (res.code === 1) {
          commit('changeLogin', true)
        } else {
          commit('changeLogin', false)
          router.push('/login')
        }
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 注销
  logoutAsync ({commit}) {
    return new Promise((resolve, reject) => {
      logout().then((res) => {
        if (res.code === 1) {
          commit('changeLogin', false)
        }
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
