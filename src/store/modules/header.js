// header公共组件状态库

const state = {
  // 是否登录状态
  ifLogin: false,
  // 搜索框内容
  searchVal: '',
  // 搜索类型
  searchType: 'people',
  // 搜索按钮点击次数
  searchClick: 0,
  selectClick: 0
}

const getters = {
  getSearchClick (state) {
    return state.searchClick
  },
  getSearchVal (state) {
    return state.searchVal
  },
  getSelectClick (state) {
    return state.selectClick
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
  },
  changeSearchClick (state, num) {
    state.searchClick += num
  },
  changeSelectClick (state) {
    state.selectClick++
  }
}
const actions = {
  changeSearchClick (ctx, num) {
    ctx.commit('changeSearchClick', num)
  },
  changeSelectClick (ctx) {
    ctx.commit('changeSelectClick')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations

}
