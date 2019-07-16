import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由列表
let routes = [
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

// 登录类型 normal、sso
const loginType = process.env.VUE_APP_loginType

if (loginType === 'sso') {
  routes.push({
    path: '/',
    redirect: '/home'
  })
} else {
  routes.push({
    path: '/',
    redirect: '/login'
  })
  routes.push({
    path: '/login',
    name: 'login',
    component: () => import('./views/login.vue')
  })
}
console.log('登录类型:', loginType)
console.log('前端路由:', routes)

export default new Router({
  mode: 'hash',
  routes: routes
})
