// header公共组件状态库

const state = {
  // 是否登录状态
  ifLogin: false,
  // 搜索框内容
  searchVal: '',
  // 搜索类型
  searchType: 'people'
}

const getters = {
  getSearchVal (state) {
    return state.searchVal
  }
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
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations

}
