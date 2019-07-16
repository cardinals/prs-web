import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // 重定向根路径对应的模块
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/home.vue')
    },
    {
      path: '/searchList/:searchType/:searchVal',
      name: 'searchList',
      component: () => import('./views/searchList.vue')
    },
    {
      path: '/detail/:personId/',
      name: 'detail',
      redirect: '/detail/:personId/info',
      component: () => import('./views/peopleDetailContainer.vue'),
      children: [
        {
          path: '/detail/:personId/info',
          name: 'info',
          component: () => import('./views/peopleInfo.vue')
        },
        {
          path: '/detail/:personId/peoplePath/:type',
          name: 'peoplePath',
          component: () => import('./views/peoplePath.vue')
        },
        {
          path: '/detail/:personId/dynamic/:type',
          name: 'dynamic',
          component: () => import('./views/peopleDynamic.vue')
        },
        {
          path: '/detail/:personId/relationship/:type',
          name: 'relationship',
          component: () => import('./views/peopleRelationship.vue')
        }
      ]
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
