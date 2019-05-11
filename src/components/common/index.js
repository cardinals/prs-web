/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:02:08
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:52:25
 */

import headerCom from '@/components/common/header'
import footerCom from '@/components/common/footer'
import sideBar from '@/components/common/sideBar'
import anchorPoint from '@/components/common/anchorPoint'
import goTop from '@/components/common/goTop'

export default {
  install: function (vue) {
    vue.component('headerCom', headerCom)
    vue.component('footerCom', footerCom)
    vue.component('sideBar', sideBar)
    vue.component('anchorPoint', anchorPoint)
    vue.component('goTop', goTop)
  }
}
