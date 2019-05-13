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
          <span class="span" :class="{'active':searchType === 'case'}" @click="searchType = 'case'">搜案例</span>
          <span class="span" :class="{'active':searchType === 'org'}" @click="searchType = 'org'">搜机构</span>
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
          <div class="moveClickBtn left" :class="{'noVisibility':firstCardIndex===0}" @click="moveLeft"></div>
          <!-- 卡片固定窗口容器 -->
          <div class="peopleInfoCardContainer" >
            <!-- 卡片移动窗口容器 -->
            <div class="moveContainer flexRow" id="moveContainer">
              <!-- 人物信息卡片 -->
              <div class="peopleInfoCard" v-for="(item, index) in cardContent" :key="index" style="font-size:30px;">
                <!-- 卡片内容 -->
                <div class="content flexColumn">
                  <div class="photo">
                    <div :class="{'man': item.gender === '男', 'women': item.gender === '女', 'unknown': item.gender === '未知'}"></div>
                  </div>
                  <div class="name" :class="{'man': item.gender === '男', 'women': item.gender === '女', 'unknown': item.gender === '未知'}">{{ item.name }}</div>
                  <div class="type"> {{ item.peopleType }} </div>
                </div>
                <!-- 卡片脚部 -->
                <div class="cardFooter">
                  近期共有<span> {{ item.abnormalNum }} </span>项<span> {{ item.abnormalName }}</span>
                </div>
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
import { mapState, mapMutations } from 'vuex'
import { tipsCN, tipsEN, recommend, collectionList, collection, requestCount } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  name: 'home',
  data () {
    return {
      searchType: 'people', // 搜索类型
      cardContent: [ // 最新动态卡片内容
        {
          name: '胡晨竹',
          photo: '',
          gender: '女',
          peopleType: '矫正人员',
          abnormalNum: 3,
          abnormalName: '异常关系'
        },
        {
          name: '刘国兴',
          photo: '',
          gender: '男',
          peopleType: '司法人员',
          abnormalNum: 1,
          abnormalName: '异常轨迹'
        },
        {
          name: '樊琴',
          photo: '',
          gender: '女',
          peopleType: '司法人员',
          abnormalNum: 5,
          abnormalName: '异常动态'
        },
        {
          name: '李爱国',
          photo: '',
          gender: '男',
          peopleType: '矫正人员',
          abnormalNum: 8,
          abnormalName: '异常轨迹'
        },
        {
          name: '吴曦',
          photo: '',
          gender: '女',
          peopleType: '矫正人员',
          abnormalNum: 1,
          abnormalName: '异常关系'
        },
        {
          name: '孙建党',
          photo: '',
          gender: '男',
          peopleType: '矫正人员',
          abnormalNum: 3,
          abnormalName: '异常关系'
        },
        {
          name: '赵国华',
          photo: '',
          gender: '男',
          peopleType: '矫正人员',
          abnormalNum: 3,
          abnormalName: '异常关系'
        },
        {
          name: '李琴',
          photo: '',
          gender: '未知',
          peopleType: '矫正人员',
          abnormalNum: 3,
          abnormalName: '异常关系'
        }
      ],
      firstCardIndex: 0, // 卡片开始索引，用于控制箭头和卡片移动
      search: '', // 搜索输入框内容
      showWhich: 'recommend',
      commonArr: [],
      hotArr: [],
      collectionArr: [],
      reqCount: {
        caseCount: 0,
        judgementCount: 0,
        protocolCount: 0,
        requestCount: 0
      },
      pages: 1,
      flag: true
    }
  },
  computed: {
    ...mapState('header', {
      ifLogin: state => state.ifLogin
    })
  },
  filters: {
    // 映射关系
    changeType (val) {
      let arr1 = ['mediateCase', 'protocol', 'law', 'judgement']
      let arr2 = ['案例', '协议', '法条', '文书']
      return arr2[arr1.indexOf(val)]
    }
  },
  watch: {
    // 监控一下header的是否登录状态,注意这里不要用箭头函数导致this指向有问题
    ifLogin: function (to, from) {
      let _this = this
      if (to) {
        this.collectionListInit(1).then((res) => {
          _this.collectionArr = res.data.pageData
        })
      }
    }
  },
  methods: {
    moveLeft () {
      this.firstCardIndex--
      document.getElementById('moveContainer').transform = 'translateX(256px)'
      document.getElementById('moveContainer').style.transform = 'translateX(-' + (256 * this.firstCardIndex) + 'px)'
    },
    moveRight () {
      this.firstCardIndex++
      document.getElementById('moveContainer').style.transform = 'translateX(-' + (256 * this.firstCardIndex) + 'px)'
    },
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
      if (CN) {
        tipsCN({ 'prefix': CN }).then((res) => {
          callback(res.data)
        })
      } else {
        tipsEN({ 'prefix': queryString }).then((res) => {
          callback(res.data)
        })
      }
    },
    // 推荐列表
    recommendInit () {
      return new Promise((resolve, reject) => {
        recommend().then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 收藏列表
    collectionListInit (page) {
      return new Promise((resolve, reject) => {
        collectionList({ 'pagenum': page, 'pagesize': 5 }).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 取消收藏
    unCollection (ev, params) {
      collection({
        'id': params.ajid,
        'detailType': params.detailType,
        'subtype': params.subtype,
        'title': params.title
      }).then((res) => {
        if (res.code === 6) {
          // 隐藏节点，防止刷新页面
          ev.target.parentElement.style.display = 'none'
          Message({
            message: res.message,
            type: 'success'
          })
        } else {
          Message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 收藏跳转
    goDetail (type, id) {
      if (type === 'mediateCase') {
        this.$router.push('/mediationCaseDetails/' + id)
      } else if (type === 'protocol') {
        this.$router.push('/mediationAgreementDetail/' + id)
      } else if (type === 'judgement') {
        this.$router.push('/judgmentDocumentDetail/' + id)
      } else if (type === 'law') {
        this.$router.push('/lawsDetail/' + id)
      }
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
    }
  },
  mounted () {
    let _this = this
    // 初始化推荐列表
    this.recommendInit().then((res) => {
      if (res.code === 1) {
        _this.commonArr = res.data.datacj
        _this.hotArr = res.data.datarm
      } else {
        Message({
          message: res.message,
          type: 'warning'
        })
      }
    })
    // 如果不是从登录页面跳转进来，初始化组件的时候就能拿到公共状态
    // 如果从登录页面进来，则需要watch ifLogin状态的异步操作
    // 初始化收藏列表
    if (this.ifLogin) {
      this.collectionListInit(_this.pages).then((res) => {
        if (res.code === 1) {
          _this.collectionArr = res.data.pageData
        } else {
          Message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
    // 初始化访问量统计
    requestCount().then((res) => {
      // 加个数字滚动效果
      let index = 0
      let data = res.data
      let timer = setInterval(() => {
        if (index >= 21) {
          clearInterval(timer)
        } else {
          _this.reqCount = {
            caseCount: parseInt(parseInt(data.caseCount) / 20 * index),
            judgementCount: parseFloat(parseFloat(data.judgementCount) / 20 * index).toFixed(1),
            protocolCount: parseInt(parseInt(data.protocolCount) / 20 * index),
            requestCount: parseInt(parseInt(data.requestCount) / 20 * index)
          }
          index++
        }
      }, 50)
    })
    // 添加滚轮事件添加收藏列表
    window.addEventListener('mousewheel', function (ev) {
      if ((ev.wheelDelta < 0 || ev.detail < 0) && _this.showWhich === 'collection' && _this.ifLogin && _this.flag && _this.$route.name === '首页') {
        _this.pages += 1
        _this.collectionListInit(_this.pages).then((res) => {
          if (res.code === 1) {
            if (res.data.pageData.length === 0) {
              Message({
                message: '没有更多收藏了',
                type: 'warning'
              })
              _this.flag = false
            }
            res.data.pageData.forEach((item) => {
              _this.collectionArr.push(item)
            })
          } else {
            Message({
              message: res.message,
              type: 'warning'
            })
          }
        })
      }
    })
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
