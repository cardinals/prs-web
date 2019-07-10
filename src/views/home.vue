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
            :placeholder="placeholder"
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
                  <div class="photo" @click="goPeopleInfo(item)">
                    <!-- <img :src="pictureData[item.personId]" v-if="pictureData[item.personId]"> -->
                    <div :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknown': item.gender === '未知'}" v-if="true"></div>
                  </div>
                  <div class="name" :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknown': item.gender === '未知'}" @click="goPeopleInfo(item)">{{ item.name }}</div>
                  <div class="type"> {{ item.peopleType }} </div>
                </div>
                <!-- 卡片脚部 -->
                <!-- upsideDownRoll 为自定义的组件，里面的内容放置在组件的默认插槽中 -->
                <upsideDownRoll :height="55" :lineNum="Object.getOwnPropertyNames(abnormalFilter(item.abnormal)).length" :id="item.personId+''">
                  <div class="cardFooter" v-for="(value, key) in abnormalFilter(item.abnormal)" :key="key">
                    近三月共有<span> {{ value }} </span>项<span @click="goAbnormalPage(key,item.personId); log(item)"> {{ key|keyTranslation }}</span>
                  </div>
                </upsideDownRoll>
              </div>
            </div>
          </div>
          <div class="moveClickBtn right" :class="{'noVisibility':firstCardIndex + 5 >= cardContent.length}" @click="moveRight"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { tipsCN, tipsEN, latestNews, queryLogs } from '@/api/api.js'
import { Message } from 'element-ui'
import changePage from '@/components/mixins/changePage'
// 异常中英文名称映射
let abnormalMap = {
  abnormalRelation: '异常关系',
  abnormalDynamic: '异常动态',
  abnormalTrail: '异常轨迹'
}
export default {
  name: 'home',
  data () {
    return {
      pictureData: {}, // 照片信息
      searchType: 'people', // 搜索类型
      cardContent: [], // 最新动态卡片内容
      firstCardIndex: 0, // 卡片开始索引，用于控制箭头和卡片移动
      search: '', // 搜索输入框内容
      defaultMove: null,
      placeholder: '请输入人名、身份证号(最少2位)、电话号码(最少3位)'
    }
  },
  mixins: [changePage.getMixin()],
  computed: {
    ...mapState('header', {
      ifLogin: state => state.ifLogin
    })
  },
  methods: {
    // 改变异常动态页的通知栏状态
    ...mapActions({
      changeShowMsg: 'dynamic/changeShowMsg',
      RechangeShowMsg: 'relation/changeShowMsg',
      PathchangeShowMsg: 'path/changeShowMsg'
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
    async latestNewsInit () {
      let res = await latestNews()
      this.cardContent = res.data
    },
    // 跳转搜索页
    goSearch () {
      let _this = this
      this.changeSearchVal(_this.search)
      this.changeSearchType(_this.searchType)
      if (this.search === '') {
        Message({
          message: '请输入搜索信息',
          type: 'warning'
        })
      } else if (/^[0-9]+$/.test(_this.search) && this.search.length < 2) {
        Message({
          message: '数字查询时，请最少输入两位及以上的数字',
          type: 'warning'
        })
      } else {
        this.$router.push('/searchList/' + _this.searchType + '/' + _this.search)
      }
    },
    // 跳转至人物信息页
    goPeopleInfo (item) {
      this.log(item)
      let routeUrl = this.$router.resolve({ path: `/detail/${item.personId}/info` })
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
    // 日志记录，主要记录最新动态中人物的点击情况
    log (item) {
      queryLogs(
        {
          g_id: item.personId,
          querytype: this.searchType,
          name: item.name,
          querycontent: ''
        }
      )
    }
  },
  filters: {
    // 异常值名称的中英文转换
    keyTranslation (val) {
      return abnormalMap[val]
    }
  },
  mounted () {
    // 请求最新动态的数据
    this.latestNewsInit()

    // 适应屏幕高度，让首页整体的内容区域居中
    this.$nextTick(() => {
      let a = document.getElementsByClassName('home')[0].style
      a.paddingTop = document.body.clientHeight - 861 + 'px'
      window.onresize = function () {
        a.paddingTop = document.body.clientHeight - 861 + 'px'
      }
    })
  }
}
</script>
<style lang="less">
  @import '~@/assets/css/home.less';
</style>
