const state = {
  dynamicShowMsg: true,
  pathShowMsg: true,
  ralationShowMsg: true,
  dangerContentHeight: 0
}
const mutations = {
  hideMsg (state, name) {
    state[name] = false
  },
  showAllMsg (state) {
    state.dynamicShowMsg = true
    state.pathShowMsg = true
    state.ralationShowMsg = true
  },
  changeHeight (state, height) {
    state.dangerContentHeight = height
  }
}
const actions = {
  hideMsg (ctx, name) {
    ctx.commit('hideMsg', name)
  },
  showAllMsg (ctx) {
    ctx.commit('showAllMsg')
  },
  changeHeight (ctx, height) {
    ctx.commit('changeHeight', height)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
