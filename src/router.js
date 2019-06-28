import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/networkMap',
      name: 'networkMap',
      component: () => import('./views/networkMap.vue')
    },
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
      path: '/detail/:people/',
      name: 'detail',
      redirect: '/detail/:people/info',
      component: () => import('./views/peopleDetailContainer.vue'),
      children: [
        {
          path: '/detail/:people/info',
          name: 'info',
          component: () => import('./views/peopleInfo.vue')
        },
        {
          path: '/detail/:people/peoplePath/:showNormal',
          name: 'peoplePath',
          component: () => import('./views/peoplePath.vue')
        },
        {
          path: '/detail/:people/dynamic/:showNormal',
          name: 'dynamic',
          component: () => import('./views/peopleDynamic.vue')
        },
        {
          path: '/detail/:people/relationship/:showNormal',
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
