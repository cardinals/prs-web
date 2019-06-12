<template>
  <div class="searchList">
    <!-- 搜索条件标签栏 -->
    <div class="searchCondition clearfix">
      <div class="label">搜索条件:</div>
      <transition-group name="rotate">
        <div class="buttons" v-for="(value, index) in keywordArr" :key="`button${index}`">
          <span :class="value.type" class="typeIcon"></span>
          <span class="span">{{value.name|cantOver}}</span>
          <span class="iconx" @click="deleteKeyword(value)">×</span>
        </div>
      </transition-group>
      <div @click="resetAll" class="reset" v-if="keywordArr.length!==0">重置条件</div>
    </div>

    <!-- 相关搜索暂时不要 -->
    <div v-if="true" class="searchCondition">
      <span class="label">相关搜索</span>
      <span class="searchTags" v-for="(item, index) in treeData1.aboutSearch" :key="index" @click="goAboutSearch(item)">
        {{item}}
      </span>
    </div>
    <div class="treeList clearfix">
      <!-- 案件分类 和 关键词 -->
      <div class="tree">
        <el-collapse v-model="treeOpenDefault">
          <el-collapse-item v-for="(value, key) in treeData1.tree" :key="key" class="classify"  :name="key" >
            <template slot="title">
              <div class="titles" :class="{'expand': treeStatus[key], 'noData': value.length === 0}" @click="treeStatus[key] = !treeStatus[key]">
                <div class="img" :class="key"></div>
                <div class="text">{{key|treeFilter}}</div>
                <div class="titleIcon"></div>
              </div>
            </template>
            <div>
              <el-tree ref="zhangTest"
              class="main"
              :data="value"
              :props="defaultProps"
              @node-click="((val1)=>{
                handleNodeClick(val1, key)
                })"
              highlight-current
              :empty-text="''"
              :icon-class="iconChange()"
              :expand-on-click-node="false"
              >
                <template slot-scope="scope">
                  <span :title='scope.node.label'>{{ scope.node.label|labelFilter }}</span>
                </template>
              </el-tree>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 右边列表 -->
      <div class="list">
        <div class="others">
          <div class="label">排序:</div>
          <div class="sort active">
            <span @click="sortChange">按相关度</span>
            <i class="el-icon-download" v-if="sortFlag === 'desc'"></i>
            <i class="el-icon-upload2" v-if="sortFlag === 'asc'"></i>
          </div>
          <div class="num" v-if='listData !== null'>共找到 <span style="color:#2770EE">{{listData.resultNum}}</span> {{resultNumUnit}}</div>
        </div>
        <div v-if ="listData !== null">
        <div class="resultList" v-for="(item,index) in listData.pageContent" :key="index" >
          <div class="card">
            <div class="peopleInfo">
              <div class="photo" @click="toDetail(item.personId)">
                <!-- 预留以后有照片的情况 -->
                <!-- <div :class="{'man': imagetest(item) === '' && item.gender === '男性', 'women': imagetest(item) === '' && item.gender === '女性', 'unknow': imagetest(item) === '' && item.gender === '未知'}" v-if="imagetest(item) === ''"></div>
                <img :src="imagetest(item)" v-if="imagetest(item) !== ''"> -->

                <div :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknow': item.gender === '未知'}" v-if="true"></div>
              </div>
              <div class="info">
                <div class="line1">
                  <span class="name" @click="toDetail(item.personId)"> {{ item.name }}</span>
                  <div class="img" :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknow': item.gender === '未知'}"></div>
                  <div class="tags">
                    <div class="tag" v-for="(item,index) in item.tags" :key="index"> {{item.name}} </div>
                  </div>
                </div>
                <div class="line2">
                  <div></div>
                  <span :style="item.idNumber === '' ? 'color:#989A9F' : ''">{{item.idNumber|idNodata}}</span>
                </div>
                <div class="line3">
                  <span :style="item.birthday === '' ? 'color:#989A9F' : ''">{{item.birthday|nodata}}</span>
                  <span>/</span>
                  <span :style="item.birthPlace === '' ? 'color:#989A9F' : ''">{{item.birthPlace|nodata}}</span>
                  <span>/</span>
                  <span :style="item.mobile === '' ? 'color:#989A9F' : ''">{{item.mobile|nodata}}</span>
                </div>
                <div class="line4">
                  {{item.homeAddress|nodata}}
                </div>
              </div>
            </div>
            <div class="abnormal" v-if="item.abnormalDynamic !== 0 || item.abnormalTrail !== 0 || item.abnormalRelation !== 0">
              <div class="abnormalContent"  @click="goAbnormalPage('abnormalDynamic', item.personId)">
                <div class="img trend"></div>
                <span>异常动态:</span>
                <span>{{item.abnormalDynamic}} 项</span>
              </div>
              <div class="abnormalContent"  @click="goAbnormalPage('abnormalTrail', item.personId)">
                <div class="img path"></div>
                <span>异常轨迹:</span>
                <span>{{item.abnormalTrail}}项</span>
              </div>
              <div class="abnormalContent"  @click="goAbnormalPage('abnormalRelation', item.personId)">
                <div class="img relationship"></div>
                <span>异常关系:</span>
                <span>{{item.abnormalRelation}}项</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="nodataImg" v-if="listData === null">根据搜索条件未匹配到相应结果</div>
        <div v-if="listData !==null " class="page">
          <el-pagination
            layout="prev, pager, next"
            :total="listData.resultNum"
            :page-size="5"
            :current-page="currentPage"
            @current-change="currentChange"
            >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchList, recommendList, log, getListData, getPhotoData } from '@/api/api.js'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
const treeTitleMap = {
  gender: '性别',
  age: '年龄分布',
  birthPlace: '籍贯',
  homeAddress: '居住地',
  tags: '标签'
}
let apiParams = {
  'age': '',
  'hujidizhi': '',
  'juzhudi': '',
  'label': [],
  'order': 'desc',
  'pagecapacity': 5,
  'pagenumber': 1,
  'query': '',
  'xingbie': '',
  'querytype': ''
}
const paramsMap = {
  age: (val) => { apiParams['age'] = val.name },
  birthPlace: (val) => { apiParams['hujidizhi'] = val.nameid },
  homeAddress: (val) => { apiParams['juzhudi'] = val.nameid },
  tags: (val) => {
    if (apiParams['label'].indexOf(val.name) < 0) apiParams['label'].push(val.name)
  },
  gender: (val) => { apiParams['xingbie'] = val.nameid }
}
const delParamsMap = {
  age: (val) => { apiParams['age'] = '' },
  birthPlace: (val) => { apiParams['hujidizhi'] = '' },
  homeAddress: (val) => { apiParams['juzhudi'] = '' },
  gender: (val) => { apiParams['xingbie'] = '' },
  tags: (val) => { apiParams['label'].splice(apiParams['label'].indexOf(val), 1) }
}
export default {
  data () {
    return {
      treeOpenDefault: ['gender', 'age', 'birthPlace', 'homeAddress', 'tags'],
      keywordArr: [],
      pictureData: {},
      treeData1: [], // 树状结构数据
      treeStatus: {
        gender: true,
        age: true,
        birthPlace: true,
        homeAddress: true,
        tags: true
      },
      state: '',
      treeData: [],
      listData: [],

      defaultProps: {
        children: 'cities',
        label: 'name',
        title: 'nameShort'
      },
      caseType: '',
      caseTypeId: '',
      keyword: [],
      sortFlag: 'desc',
      keywordAggs: [],
      pageTotal: 0,
      pageSize: 5,
      currentPage: 1,
      primaryList: [], // 记录原始列表
      renderList: [], // 实际渲染列表
      dissensionId: '',
      judgement: [],
      law: [],
      protocol: [],
      mediateCase: [],
      prevDom: '', // 记录旧的dom节点
      timeout: '', // 设置输入延迟
      keyRex: [],
      tree: []
    }
  },
  computed: {
    ...mapGetters({ getSearchClick: 'header/getSearchClick' }),
    searchVal () {
      return this.$route.params.val
    },
    searchType () {
      console.log('searchType changed')
      return this.$route.params.type
    },
    resultNumUnit () {
      if (this.$route.params.type === 'people') return '位相关人员'
      if (this.$route.params.type === 'case') return '件相关案件'
      if (this.$route.params.type === 'org') return '个相关机构'
      return null
    }
    // keywordArr () {
    //   let arr = []
    //   if (this.searchVal !== '') {
    //     arr.push({
    //       type: 'searchVal',
    //       val: this.searchVal
    //     })
    //   } else {
    //     // 如果searchVal为空，清空所有搜索条件
    //     this.resetAll()
    //   }
    //   if (this.caseType !== '') {
    //     arr.push({
    //       type: 'caseType',
    //       val: '案件分类:' + this.caseType,
    //       name: this.caseType
    //     })
    //   }
    //   if (this.keyword.length !== 0) {
    //     this.keyword.map((item) => {
    //       arr.push({
    //         type: 'keyword',
    //         val: '关键词:' + item,
    //         name: item
    //       })
    //     })
    //   }
    //   return arr
    // }
  },
  watch: {
    getSearchClick () {
      if (this.keywordArr.length === 0) {
        this.keywordArr.push({
          type: 'searchVal',
          name: this.$route.params.val
        })
        apiParams.pagenumber = 1
        this.searchListInit1()
      }
    },
    // 监控跟搜索有关的参数
    keywordArr: function (newVal, oldVal) {
      this.currentPage = 1
      this.searchListInit()
    },
    searchVal: function (newVal, oldVal) {
      console.log('searchVal changed')
      // this.searchListInit1()
      if (oldVal !== '' && oldVal !== newVal) {
        // this.$router.push('/searchList/' + this.searchType + '/' + newVal)
        // this.$store.commit('header/changeSearchVal', newVal)
        this.keywordArr = []
        this.keywordArr.push({
          type: 'searchVal',
          name: this.$route.params.val
        })
        apiParams.pagenumber = 1
        this.searchListInit1()
        this.caseType = ''
        this.caseTypeId = ''
        this.keyword = []
      }
    },
    caseType: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.keyword = []
      }
    },
    // sortFlag: function (newVal, oldVal) {
    //   this.currentPage = 1
    //   this.searchListInit()
    // },
    searchType: function (newVal, oldVal) {
      this.currentPage = 1
      if (oldVal !== newVal) {
        this.caseType = ''
        this.keyword = []
      }
    }
  },
  filters: {
    labelFilter (val) {
      if (val.length > 10) {
        return val.substring(0, 10) + '...'
      } else {
        return val
      }
    },
    changeNull (val) {
      return !val ? '暂无信息' : val
    },
    // 限定字数不能超过10
    cantOver (val) {
      return val.length > 11 ? val.slice(0, 10) + '...' : val
    },
    treeFilter (val) {
      return treeTitleMap[val]
    },
    idNodata (val) {
      return val === '' ? '暂无' : val.substring(0, 6) + '********' + val.substring(14, 18)
    },
    nodata (val) {
      return val === '' ? '暂无' : val
    }
  },
  methods: {
    toDetail (val) {
      let routeUrl = this.$router.resolve({
        path: '/detail/' + val
      })
      window.open(routeUrl.href, '_blank')
      // this.$router.push('/detail/' + val)
    },
    iconChange (isOpen) {
      return 'el-icon-plus'
    },
    imagetest (item) {
      return this.pictureData[item.personId]
    },
    // 展示列表的下拉框
    showDom (ev, val, id) {
      let _this = this
      // 选取节点
      let node = this.$refs[id][0]
      // 优化一下推荐列表接口的调用
      if (this.dissensionId === id) {
        if (this.state !== val) {
          this.state = val
          this.$nextTick(() => {
            node.style.height = node.firstElementChild.offsetHeight + 11 + 'px'
          })
        } else {
          this.state = ''
          this.$nextTick(() => {
            node.style.height = node.firstElementChild.offsetHeight + 11 + 'px'
          })
        }
      } else {
        // 获取推荐列表
        recommendList({
          id: id,
          detailType: _this.searchType
        }).then((res) => {
          if (res.code === 1) {
            let data = res.data
            if (data.judgement && data.judgement.length >= 1) { _this.judgement = data.judgement.slice(0, 2) }
            if (data.law && data.law.length >= 1) { _this.law = data.law.slice(0, 2) }
            if (data.protocol && data.protocol.length >= 1) { _this.protocol = data.protocol.slice(0, 2) }
            if (data.mediateCase && data.mediateCase.length >= 1) { _this.mediateCase = data.mediateCase.slice(0, 2) }
          } else {
            _this.showMessage(res.message, 'warning')
          }
          _this.state = val
          _this.dissensionId = id
          // 更新dom后再修改高度
          _this.$nextTick(() => {
            if (_this.prevDom !== '') {
              _this.$refs[_this.prevDom][0].style.cssText = ''
            }
            node.style.height = node.firstElementChild.offsetHeight + 11 + 'px'
            _this.prevDom = id
          })
        })
      }
    },
    // 提交日志
    commitLog () {
      log(({
        query: this.searchVal,
        queryType: this.searchType,
        caseType: this.caseTypeId,
        keyword: this.keyword,
        sortFlag: this.sortFlag,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }))
    },
    // 分页插件事件
    handleSizeChange (val) {
      this.pageSize = val
      this.render()
      this.commitLog()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.render()
      this.commitLog()
    },
    // 树形插件点击事件
    handleNodeClick () {
      apiParams.pagenumber = 1
      paramsMap[arguments[1]](arguments[0])
      this.addKeyword(arguments[1], arguments[0].name)
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    },
    // 搜索接口&&初始化搜索列表
    async searchListInit () {
      const _this = this
      _this.$store.dispatch({ type: 'app/changeLoadingStatus', amount: true })
      _this.commitLog()
      const res = await searchList({
        query: _this.searchVal,
        queryType: _this.searchType,
        caseType: _this.caseTypeId,
        keyword: _this.keyword,
        sortFlag: _this.sortFlag
      })
      let data = res.data
      if (res.code === 1) {
        // 左侧案件分类树和关键词
        _this.treeData = data.typeAggs.map((item) => {
          item.children = item.children || []
          return {
            'name': item.name + '(' + item.value + ')',
            'realName': item.name,
            'id': item.typeId,
            'children': item.children.map((item) => {
              return {
                'name': item.name + '(' + item.value + ')',
                'realName': item.name,
                'id': item.typeId
              }
            })
          }
        })
        _this.keywordAggs = data.keywordAggs
        // 分页
        _this.pageTotal = data.result.length
        // 记录原始数据
        _this.primaryList = data.result
        // 记录关键词
        _this.keyRex = data.queryKeyword
      } else {
        _this.showMessage(res.message, 'warning')
      }
      _this.render()
      _this.$store.dispatch({ type: 'app/changeLoadingStatus', amount: false })
    },
    // 渲染搜索列表
    render () {
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.renderList = this.primaryList.slice(start, end)
      // 渲染的时候滚动条滚到最上面
      this.goTop()
    },
    // 滚动条体验优化
    goTop () {
      this.state = ''
      this.dissensionId = ''
      // 重置一下元素
      document.querySelectorAll('.otherInfo ').forEach((item) => {
        item.style.cssText = ''
      })
      document.querySelectorAll('.hide_c ').forEach((item) => {
        item.style.cssText = ''
      })
      this.prevDom = ''
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let index = 1
      let timer = setInterval(() => {
        document.querySelector('html').scrollTop -= scrollTop / 20
        index++
        if (index === 21) { clearInterval(timer) }
      }, 10)
    },
    // 标红关键字
    keywords (val) {
      // 判断val是否为undefined，解决v-if机制问题，未查明原因
      if (val) {
        // let keyWords = new RegExp('([' + this.searchVal + ']{2,})', 'gi')
        let str = ''
        this.keyRex.forEach((item, index) => {
          if (index !== 0) {
            str += '|' + item
          } else {
            str += item
          }
        })
        let keyWords = new RegExp('(' + str + ')', 'gi')
        let newval = val.replace(/\\n/g, '')
        newval = newval.length > 110 ? newval.substring(0, 110) + '...' : newval
        return newval.replace(keyWords, `<em style="color:#F74D4E;font-size:inherit">$1</em>`)
      }
    },
    // 添加关键词
    addKeyword (type, name) {
      if (this.indexOfKeywordArr(type, name) < 0) {
        this.keywordArr.push({
          type: type,
          name: name
        })
      }
    },
    indexOfKeywordArr (type, name) {
      for (let i = 0; i < this.keywordArr.length; i++) {
        if (this.keywordArr[i].name === name && this.keywordArr[i].type === type) {
          return i
        }
      }
      return -1
    },
    // 删除关键词
    deleteKeyword (val) {
      if (val.type === 'searchVal') {
        this.$store.commit('header/changeSearchVal', '')
        this.keywordArr = []
        apiParams = apiParams = {
          'age': '',
          'hujidizhi': '',
          'juzhudi': '',
          'label': [],
          'order': 'desc',
          'pagecapacity': 5,
          'pagenumber': 1,
          'query': '',
          'xingbie': '',
          'querytype': ''
        }
      } else {
        this.keywordArr.splice(this.indexOfKeywordArr(val.type, val.name), 1)
        delParamsMap[val.type](val.name)
        apiParams.pagenumber = 1
      }
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
      // this.$forceUpdate()
    },
    // 清空所有条件
    resetAll () {
      this.keywordArr.splice(1, this.keywordArr.length - 1)
      apiParams = {
        'age': '',
        'hujidizhi': '',
        'juzhudi': '',
        'label': [],
        'order': 'desc',
        'pagecapacity': 5,
        'pagenumber': 1,
        'query': this.$route.params.val,
        'xingbie': '',
        'querytype': this.$route.params.type
      }
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    },
    goAboutSearch (val) {
      this.$store.commit('header/changeSearchVal', val)
      this.$router.push('/searchList/people/' + val)
      apiParams = {
        'age': '',
        'hujidizhi': '',
        'juzhudi': '',
        'label': [],
        'order': 'desc',
        'pagecapacity': 5,
        'pagenumber': 1,
        'query': this.$route.params.val,
        'xingbie': '',
        'querytype': this.$route.params.type
      }
      this.keywordArr[0].name = val
      this.$forceUpdate()
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    },
    // 处理字符串变数组
    arrToString (val) {
      return val === null ? [] : val.split('|')
    },
    // 打开新窗口
    openUrl (url, id) {
      window.open(window.location.origin + '/#/' + url + '/' + id)
    },
    showMessage (message, type, duration) {
      Message({
        message: message || '',
        type: type || 'warning',
        duration: duration || 2000
      })
    },
    currentChange (val) {
      apiParams['pagenumber'] = val
      this.currentPage = val
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    },
    goAbnormalPage (key, val) {
      let routeUrl = {
        abnormalDynamic: this.$router.resolve({ path: `/detail/${val}/dynamic` }),
        abnormalRelation: this.$router.resolve({ path: `/detail/${val}/relationship` }),
        abnormalTrail: this.$router.resolve({ path: `/detail/${val}/peoplePath` })
      }
      window.open(routeUrl[key].href, '_blank')
    },
    sortChange () {
      this.currentPage = 1
      if (this.sortFlag === 'desc') {
        this.sortFlag = 'asc'
      } else if (this.sortFlag === 'asc') {
        this.sortFlag = 'desc'
      }
      apiParams.pagenumber = 1
      apiParams.order = this.sortFlag
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    },
    searchListInit1 () {
      apiParams['query'] = this.$route.params.val
      apiParams['querytype'] = this.$route.params.type
      getListData(apiParams).then(res => {
        this.treeData1 = res.data.result_tree || {}
        this.listData = res.data.result_list || null
      })
    }
  },
  mounted () {
    // 优化刷新网页的时候状态丢失
    this.keywordArr.push({
      type: 'searchVal',
      name: this.$route.params.val
    })
    this.$store.commit('header/changeSearchType', this.$route.params.type)
    this.$store.commit('header/changeSearchVal', this.$route.params.val)
    // this.searchListInit()
    this.searchListInit1()
    getPhotoData().then(res => {
      this.pictureData = res
    })
  }
}
</script>

<style lang="less">
  // 过渡动画
  .rotate-enter-active{
    transition:0.6s ease;
  }
  .rotate-leave-active{
    transition: 0.4s ease;
  }
  .rotate-enter{
    opacity: 0;
    transform: rotateY(180deg);
  }
  .rotate-leave-to{
    opacity: 0;
    transform: rotateY(180deg);
  }

  // element-ui
  .el-tree-node__expand-icon{
    color:#808080;
  }
  .el-collapse-item__arrow {
    &::before {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border: 4px transparent solid;
      border-left-color:#808080;
      border-left-width: 6px;
      margin-left: 5px;
    }
  }
  .el-tree-node__expand-icon.is-leaf{
    // width: 4px;
    // height: 8px;
    margin-left:10px;
    margin-right: 8px;
    padding:2.5px;
    font-size: 0;
    border-radius: 50%;
    background: #808080;
  }
  .el-collapse-item__wrap {
    padding-left: 50px;
  }
  .el-tree-node__content{
    &:hover{
      .el-tree-node__expand-icon{
        color:#2770EE;
        background: rgba(241,245,255,1);
      }
      .el-tree-node__expand-icon.is-leaf{
        background: #669AFF;
      }
      color:#669AFF;
      background: rgba(241,245,255,1)
    }
  }

  // 展开前的小加号
  .el-tree-node__expand-icon:not(.is-leaf) {
    position: relative;
    width: 20px;
    height: 22px;
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 10px;
      height: 2px;
      background:rgba(128,128,128,1);
      top: 10px;
    }
    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 2px;
      height: 10px;
      background:rgba(128,128,128,1);
      left: 10px;
    }
    &.expanded {
      transform: none;
      &::after {
        content: "";
        height: 0;
      }
    }
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background: rgba(241,245,255,1);
    color:#669AFF;
    .el-tree-node__expand-icon.is-leaf{
      background: #669AFF;
    }
    .el-tree-node__expand-icon{
      color:#669AFF;
    }
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #669AFF;
  }
  .el-tree__empty-block {
    min-height: 0;
  }
  .el-collapse-item__header {
    background:rgba(246,246,246,1);
    &.is-active {
      background:rgba(246,246,246,1);
    }
  }
  .el-collapse-item__wrap {
    border: none;
    .el-collapse-item__content{
      padding: 0;
    }
  }
  .el-pagination {

    button {
      background: transparent !important;
    }
    .el-pager {
      background: transparent !important;
      .number {
        background: transparent !important;
      }
      .more {
        background: transparent !important;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import '~@/assets/css/searchList.less';
</style>
