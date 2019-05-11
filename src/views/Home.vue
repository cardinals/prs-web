<template>
  <div class="home">
    <div class="home_c">
      <!-- logo -->
      <div class="logo"></div>
      <!-- 类型选择 -->
      <div class="types">
        <span class="span" :class="{'active':searchType === 'mediateCase'}" @click="searchType = 'mediateCase'">调解案例</span>
        <span class="span" :class="{'active':searchType === 'protocol'}" @click="searchType = 'protocol'">调解协议</span>
        <span class="span" :class="{'active':searchType === 'judgement'}" @click="searchType = 'judgement'">裁判文书</span>
        <span class="span" :class="{'active':searchType === 'law'}" @click="searchType = 'law'">法律法规</span>
      </div>
      <!-- 搜索框 -->
      <div class="search_c">
        <el-autocomplete
            class="inline-input"
            v-model="search"
            :fetch-suggestions="querySearch"
            placeholder="请输入关键词"
            @select="handleSelect"
            :trigger-on-focus="false"
            @keydown.enter.native = "goSearch"
          >
          <template slot-scope="props">
            <div class="name">{{ props.item.text }}</div>
          </template>
          </el-autocomplete>
        <div @click="goSearch" class="search_btn">
          <i class="icon el-icon-search"></i>
        </div>
      </div>
      <!-- 精品案例 -->
      <div class="number_c">
        <div class="box">
          <div class="img img1"></div>
          <span class="num">{{reqCount.caseCount}}<em>篇</em></span>
          <span class="name">精品案例</span>
        </div>
        <i class="border"></i>
        <div class="box">
          <div class="img img2"></div>
          <span class="num">{{reqCount.judgementCount}}<em>万篇</em></span>
          <span class="name">裁判文书</span>
        </div>
        <i class="border"></i>
        <div class="box">
          <div class="img img3"></div>
          <span class="num">{{reqCount.protocolCount}}<em>篇</em></span>
          <span class="name">协议书总量</span>
        </div>
        <i class="border"></i>
        <div class="box">
          <div class="img img4"></div>
          <span class="num">{{reqCount.requestCount}}<em>次</em></span>
          <span class="name">访问总量</span>
        </div>
      </div>
      <!-- 推荐收藏 -->
      <div class="bottom_c">
        <div class="nav">
          <div class="button" :class="{'active':showWhich==='recommend'}" @click="showWhich='recommend'">推荐</div>
          <div class="button" :class="{'active':showWhich==='collection'}" @click="showWhich='collection'">收藏</div>
        </div>
        <div class="recommend clearfix" v-show="showWhich==='recommend'">
          <div class="re_left">
            <div class="title">
              <i class="border"></i>
              <span>热门检索</span>
              <i class="fire"></i>
            </div>
            <div class="ul">
              <div class="li" v-for="(item,index) in hotArr" :key="index">
                <span class="sort">{{index+1}}</span>
                <span @click="$router.push('/mediationCaseDetails/' + item.ajid)" class="content">{{item.title}}</span>
                <i class="new" v-if="index<=2"></i>
              </div>
            </div>
          </div>
           <div class="re_right" v-if="commonArr.length>0">
            <div class="title">
              <i class="border"></i>
              <span>常见检索</span>
            </div>
            <div class="ul">
              <div class="li" v-for="(item,index) in commonArr" :key="index">
                <span class="sort">{{index+1}}</span>
                <span class="content" @click="$router.push('/mediationCaseDetails/' + item.ajid)">{{item.title}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="collection" v-show="showWhich==='collection'">
          <div class="ul">
            <div class="li" v-for="item in collectionArr" :key="item.ajid">
              <div class="types"><span>{{item.detailType|changeType}}</span><i class="circle"></i></div>
              <div class="content" @click="goDetail(item.detailType,item.ajid)">{{item.title}}</div>
              <div class="btn" @click="unCollection($event,item)">取消收藏</div>
            </div>
          </div>
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
      showWhich: 'recommend',
      search: '',
      searchType: 'mediateCase',
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
    height: 65px;
    width: calc(100% - 84px);
    border-radius:4px 0px 0px 4px;
    border:1px solid rgba(231,229,229,1);
  }
  .el-input__inner{
    font-size:18px;
    height: 63px;
    border:0;
    border-radius:4px 0px 0px 4px;
  }
}
</style>

<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
