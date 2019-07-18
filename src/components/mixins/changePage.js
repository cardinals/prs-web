export default class changePage {
  static getMixin () {
    return {
      methods: {
        // 去异常页
        goAbnormalPage (key, val) {
          let routeUrl = {
            abnormalDynamic: this.$router.resolve({ path: `/detail/${val}/dynamic/err` }),
            abnormalRelation: this.$router.resolve({ path: `/detail/${val}/relationship/err` }),
            abnormalTrail: this.$router.resolve({ path: `/detail/${val}/peoplePath/err` })
          }
          window.open(routeUrl[key].href, '_blank')
        }
      }
    }
  }
}
