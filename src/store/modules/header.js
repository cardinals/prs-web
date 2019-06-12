// header公共组件状态库
import { loginStatus, logout } from '@/api/api.js'
import router from '@/router'

const state = {
  // 是否登录状态
  ifLogin: false,
  // 搜索框内容
  searchVal: '',
  // 搜索类型
  searchType: 'people',
  // 搜索按钮点击次数
  searchClick: 0
}

const getters = {
  getSearchClick (state) {
    return state.searchClick
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
  }
}
const actions = {
  // 判断是否登录
  changeLoginAsync ({ commit }) {
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
  logoutAsync ({ commit }) {
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
  },
  changeSearchClick (ctx, num) {
    ctx.commit('changeSearchClick', num)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations

}
