const state = {
  showMsg: true,
  dynamicNum: 0,
  peopleName: ''
}
const mutations = {
  changeShowMsg (state, status) {
    state.showMsg = status
  },
  changeDyNum (state, num) {
    state.dynamicNum = num
  },
  changePeopleName (state, name) {
    state.peopleName = name
  }
}
const actions = {
  changeShowMsg (ctx, status) {
    ctx.commit('changeShowMsg', status)
  },
  changeDyNum (ctx, num) {
    ctx.commit('changeDyNum', num)
  },
  changePeopleName (ctx, name) {
    ctx.commit('changePeopleName', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
