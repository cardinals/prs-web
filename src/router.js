import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // 重定向根路径对应的模块
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/home.vue')
    },
    {
      path: '/searchList/:type/:val',
      name: 'searchList',
      component: () => import('./views/searchList.vue')
    },
    {
      path: '/error/:code',
      name: 'error',
      component: () => import('./views/error.vue')
    },
    {
      path: '*',
      redirect: '/error/404'
    }
  ]
})
