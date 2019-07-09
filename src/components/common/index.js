/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:02:08
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-06-14 10:36:19
 */

import headerCom from '@/components/common/header'
import footerCom from '@/components/common/footer'
import goTop from '@/components/common/goTop'
import upsideDownRoll from '@/components/common/upsideDownRoll'
import dateCheck from '@/components/common/dateCheck'
import networkMap from '@/components/common/networkMap'

export default {
  install: function (vue) {
    vue.component('headerCom', headerCom)
    vue.component('footerCom', footerCom)
    vue.component('goTop', goTop)
    vue.component('upsideDownRoll', upsideDownRoll)
    vue.component('dateCheck', dateCheck)
    vue.component('relation', networkMap)
  }
}
