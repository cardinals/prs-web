/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:01:53
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:52:13
 */

const state = {
  // 遮罩加载状态
  isShowLoading: false,
  // 登录后的token
  token: ''
}

// mutations
const mutations = {
  changeLoadingStatus (state, status) {
    state.isShowLoading = status
  },
  setToken (state, status) {
    state.token = status
  }
}

// actions
const actions = {
  // 切换遮罩加载状态
  changeLoadingStatus ({ commit }, obj) {
    commit('changeLoadingStatus', obj.amount)
  },
  // 设置token
  setToken ({ commit }, obj) {
    commit('setToken', obj.amount)
    // 将token写入本地存储
    window.localStorage.setItem('token', obj.amount)
  },
  // 清空token
  clearToken  ({ commit }, obj) {
    commit('setToken', obj.amount)
    // 将token写入本地存储
    window.localStorage.removeItem('token')
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
