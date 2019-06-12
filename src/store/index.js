/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:02:01
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:52:18
 */

import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import header from './modules/header'
import dynamic from './modules/dynamic'
import home from './modules/home'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    header,
    dynamic,
    home
  },
  strict: process.env.NODE_ENV !== 'production'
})
