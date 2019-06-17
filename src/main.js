import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import common from './components/common/index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(common)

// 设置rem
let ww = document.documentElement.offsetWidth
ww = ww >= 1366 ? ww : 1366
document.documentElement.style.fontSize = (ww / 1920) * 100 + 'px'
// rem随屏幕变化适配
window.onresize = () => {
  let ww = document.documentElement.offsetWidth
  ww = ww >= 1366 ? ww : 1366
  document.documentElement.style.fontSize = (ww / 1920) * 100 + 'px'
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
