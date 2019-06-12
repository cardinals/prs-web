<template>
  <div class="home">
    <div class="home_c">
      <!-- logo -->
      <div class="logo"></div>
      <!-- 搜索 -->
      <div class="search_c">
        <!-- 类型选择 -->
        <div class="types">
          <span class="span" :class="{'active':searchType === 'people'}" @click="searchType = 'people'">搜人员</span>
          <span class="span" :class="{'active':searchType === 'case'}" @click="searchType = 'case'" v-if="false">搜案例</span>
          <span class="span" :class="{'active':searchType === 'org'}" @click="searchType = 'org'" v-if="false">搜机构</span>
        </div>
        <!-- 搜索框 -->
        <el-autocomplete
            class="inline-input"
            v-model="search"
            :fetch-suggestions="querySearch"
            placeholder="请输入人名、身份证号、电话号码等"
            @select="handleSelect"
            :trigger-on-focus="false"
            @keydown.enter.native = "goSearch"
          >
          <template slot-scope="props">
            <div class="name">{{ props.item.text }}</div>
          </template>
        </el-autocomplete>
        <!-- 搜索按钮 -->
        <div @click="goSearch" class="search_btn">
          搜索
        </div>
      </div>
      <!-- 最新动态 -->
      <div class="latestNews flexColumn">
        <!-- 标题logo -->
        <div class="title"></div>
        <!-- 轮播图片 -->
        <div class="carousel flexRow">
          <!-- 左箭头 -->
           <!-- @mouseenter="stopRolling" @mouseleave="startRolling" -->
          <div class="moveClickBtn left" :class="{'noVisibility':firstCardIndex===0}" @click="moveLeft"></div>
          <!-- 卡片固定窗口容器 -->
          <div class="peopleInfoCardContainer" >
            <!-- 卡片移动窗口容器 -->
            <div class="moveContainer flexRow" id="moveContainer" ref="test">
              <!-- 人物信息卡片 -->
              <!-- @mouseenter="stopRolling" @mouseleave="startRolling" -->
              <div class="peopleInfoCard" v-for="(item, index) in cardContent" :key="index" style="font-size:30px;" >
                <!-- 卡片内容 -->
                <div class="content flexColumn">
                  <div class="photo" @click="goPeopleInfo(item.name, item.personId)">
                    <img :src="pictureData[item.personId]" v-if="pictureData[item.personId]">
                    <div :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknown': item.gender === '未知'}" v-if="!pictureData[item.personId]"></div>
                  </div>
                  <div class="name" :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknown': item.gender === '未知'}" @click="goPeopleInfo(item.name, item.personId)">{{ item.name }}</div>
                  <div class="type"> {{ item.peopleType }} </div>
                </div>
                <!-- 卡片脚部 -->
                <!-- upsideDownRoll 为自定义的组件，里面的内容放置在组件的默认插槽中 -->
                <upsideDownRoll :height="55" :lineNum="Object.getOwnPropertyNames(abnormalFilter(item.abnormal)).length - 1" :id="item.personId+''">
                  <div class="cardFooter" v-for="(value, key) in abnormalFilter(item.abnormal)" :key="key">
                    近期共有<span> {{ value }} </span>项<span @click="goAbnormalPage(key,item.personId)"> {{ key|keyTranslation }}</span>
                  </div>
                </upsideDownRoll>
              </div>
            </div>
          </div>
           <!-- @mouseenter="stopRolling" @mouseleave="startRolling" -->
          <div class="moveClickBtn right" :class="{'noVisibility':firstCardIndex + 5 >= cardContent.length}" @click="moveRight"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { tipsCN, tipsEN, latestNews, getPhotoData } from '@/api/api.js'
import { Message } from 'element-ui'
import upsideDownRoll from '../components/upsideDownRoll.vue'
let abnormalMap = {
  abnormalRelation: '异常关系',
  abnormalDynamic: '异常动态',
  abnormalTrail: '异常轨迹'
}
let aaa = null
export default {
  name: 'home',
  components: {
    upsideDownRoll
  },
  data () {
    return {
      pictureData: {}, // 照片信息
      searchType: 'people', // 搜索类型
      cardContent: [ // 最新动态卡片内容
      ],
      firstCardIndex: 0, // 卡片开始索引，用于控制箭头和卡片移动
      search: '', // 搜索输入框内容
      defaultMove: null
    }
  },
  computed: {
    ...mapState('header', {
      ifLogin: state => state.ifLogin
    })
  },
  methods: {
    ...mapActions('dynamic', {
      changeShowMsg: 'changeShowMsg'
    }),
    // 左按钮
    moveLeft () {
      this.firstCardIndex--
      document.getElementById('moveContainer').transform = 'translateX(256px)'
      document.getElementById('moveContainer').style.transform = 'translateX(-' + (256 * this.firstCardIndex) + 'px)'
    },
    // 右按钮
    moveRight () {
      this.firstCardIndex++
      document.getElementById('moveContainer').style.transform = 'translateX(-' + (256 * this.firstCardIndex) + 'px)'
    },
    // 改变vuex中的搜索类型和搜索内容的值
    ...mapMutations({
      changeSearchVal: 'header/changeSearchVal',
      changeSearchType: 'header/changeSearchType'
    }),
    // 获取汉字
    ifCN (v) {
      if (v === '' || (/^\s*$/gi).test(v)) return ''
      let res = v.match(/[\u4e00-\u9fa5]*/g)
      if (res) {
        return res.join('')
      } else return false
    },
    // 选择下拉列表搜索条件
    handleSelect (select) {
      this.search = select.text
      this.goSearch()
    },
    // 搜索提示
    querySearch (queryString, callback) {
      let CN = this.ifCN(queryString)
      if (CN === '') {
        let noQuery = []
        callback(noQuery)
      }
      if (CN) {
        tipsCN({ 'query': CN }).then((res) => {
          callback(res.data)
        })
      } else {
        tipsEN({ 'prefix': queryString }).then((res) => {
          callback(res.data)
        })
      }
    },
    // 获得最新动态的数据
    latestNewsInit () {
      return new Promise((resolve, reject) => {
        latestNews().then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 跳转搜索页
    goSearch () {
      let _this = this
      this.changeSearchVal(_this.search)
      this.changeSearchType(_this.searchType)
      if (this.search !== '') {
        this.$router.push('/searchList/' + _this.searchType + '/' + _this.search)
      } else {
        Message({
          message: '请输入搜索信息',
          type: 'warning'
        })
      }
    },
    goPeopleInfo (name, id) {
      // window.localStorage.setItem('searchPeopleId', id)
      let routeUrl = this.$router.resolve({ path: `/detail/${id}/info` })
      window.open(routeUrl.href, '_blank')
    },
    // 将返回的接口数据中的异常动态、关系、轨迹中数量为0的去除
    abnormalFilter (arr) {
      let res = {}
      for (let key in arr) {
        if (arr[key] !== 0) res[key] = arr[key]
      }
      return res
    },
    goAbnormalPage (key, val) {
      let routeUrl = {
        abnormalDynamic: this.$router.resolve({ path: `/detail/${val}/dynamic` }),
        abnormalRelation: this.$router.resolve({ path: `/detail/${val}/relationship` }),
        abnormalTrail: this.$router.resolve({ path: `/detail/${val}/peoplePath` })
      }
      window.open(routeUrl[key].href, '_blank')
    },
    autoRolling () {
      console.log(this.$refs)
      if (this.firstCardIndex === 0) {
        this.defaultMove = this.moveRight
      }
      if (this.firstCardIndex + 5 === this.cardContent.length) {
        this.defaultMove = this.moveLeft
      }
      if (this.defaultMove !== null) {
        this.defaultMove()
      }
    },
    timingRolling () {
      let _this = this
      aaa = setInterval(() => {
        _this.autoRolling()
      }, 2000)
    },
    stopRolling () {
      clearInterval(aaa)
    },
    startRolling () {
      this.timingRolling()
    }
  },
  filters: {
    // 异常值名称的中英文转换
    keyTranslation (val) {
      return abnormalMap[val]
    }
  },
  mounted () {
    let _this = this
    // this.timingRolling()
    // window.onfocus = this.timingRolling
    // window.onblur = function () {
    //   clearInterval(aaa)
    // }
    // 初始化最新动态
    this.latestNewsInit().then((res) => {
      _this.cardContent = res.data
      // if (res.code === 1) {
      //   _this.commonArr = res.data.datacj
      //   _this.hotArr = res.data.datarm
      // } else {
      //   Message({
      //     message: res.message,
      //     type: 'warning'
      //   })
      // }
    })
    this.$nextTick(() => {
      let a = document.getElementsByClassName('home')[0].style
      a.paddingTop = document.body.clientHeight - 861 + 'px'
      window.onresize = function () {
        a.paddingTop = document.body.clientHeight - 861 + 'px'
      }
    })
    getPhotoData().then(res => {
      this.pictureData = res
    })
    // this.autoRolling()
  }
}
</script>
<style lang="less">
.home{
  .inline-input{
    float: left;
    height: 73px;
    width: calc(100% - 160px);
    border-radius:4px 0px 0px 4px;
    border:1px solid rgba(231,229,229,1);
  }
  .el-input__inner{
    font-size:18px;
    height: 73px;
    border:0;
    border-radius:4px 0px 0px 4px;
  }
}
</style>

<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
