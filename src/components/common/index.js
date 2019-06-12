/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:02:08
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:52:25
 */

import headerCom from '@/components/common/header'
import footerCom from '@/components/common/footer'
import goTop from '@/components/common/goTop'

export default {
  install: function (vue) {
    vue.component('headerCom', headerCom)
    vue.component('footerCom', footerCom)
    vue.component('goTop', goTop)
  }
}
