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

    <!-- 相关搜索 -->
    <div v-if="true" class="searchCondition">
      <span class="label">相关搜索</span>
      <span class="searchTags" v-for="(item, index) in treeData.aboutSearch" :key="index" @click="goAboutSearch(item)">
        {{item}}
      </span>
    </div>
    <!-- 内容区域 -->
    <div class="treeList clearfix">
      <!-- 性别、年龄分布、籍贯、居住地、标签 -->
      <div class="tree">
        <el-collapse v-model="treeOpenDefault">
          <el-collapse-item v-for="(value, key) in treeData.tree" :key="key" class="classify"  :name="key" >
            <template slot="title">
              <div class="titles" >
                <div class="img" :class="key"></div>
                <div class="text">{{key|treeFilter}}</div>
                <div class="titleIcon"></div>
              </div>
            </template>
            <div>
              <el-tree
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
        <!-- 分页标签 -->
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
import { getListData } from '@/api/api.js'
import { mapGetters } from 'vuex'

// 树状列表名称映射
const treeTitleMap = {
  gender: '性别',
  age: '年龄分布',
  birthPlace: '籍贯',
  homeAddress: '居住地',
  tags: '标签'
}

// 接口请求参数
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

// 点击树状节点对应的api参数修改方式映射
const paramsMap = {
  age: (val) => { apiParams['age'] = val.name },
  birthPlace: (val) => { apiParams['hujidizhi'] = val.nameid },
  homeAddress: (val) => { apiParams['juzhudi'] = val.nameid },
  tags: (val) => {
    if (apiParams['label'].indexOf(val.name) < 0) apiParams['label'].push(val.name)
  },
  gender: (val) => { apiParams['xingbie'] = val.nameid }
}

// 删除搜索条件对应的api参数修改方式映射
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
      treeOpenDefault: ['gender', 'age', 'birthPlace', 'homeAddress', 'tags'], // 默认展开的节点
      keywordArr: [], // 搜索条件数组
      treeData: [], // 树状结构数据
      listData: [], // 搜索结果列表数据
      defaultProps: { // 树状列表组件默认传值
        children: 'cities',
        label: 'name'
      },
      sortFlag: 'desc', // 按相关度倒序
      currentPage: 1, // 当前页码
      renderList: [] // 实际渲染列表
    }
  },
  computed: {
    ...mapGetters({
      getSearchClick: 'header/getSearchClick',
      selectClick: 'header/getSelectClick'
    }),
    searchVal () {
      return this.$route.params.val
    },
    searchType () {
      return this.$route.params.type
    },
    // 结果列表左上角总数显示
    resultNumUnit () {
      if (this.$route.params.type === 'people') return '位相关人员'
      if (this.$route.params.type === 'case') return '件相关案件'
      if (this.$route.params.type === 'org') return '个相关机构'
      return null
    }
  },
  watch: {
    // 头部搜索框内容
    selectClick (newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(this.$store.state.header.searchVal)
        this.$router.push('/searchList/' + this.searchType + '/' + this.$store.state.header.searchVal)
      }
    },
    // 监听头部搜索按钮是触发
    getSearchClick () {
      if (this.keywordArr.length === 0) {
        this.keywordArr.push({
          type: 'searchVal',
          name: this.$route.params.val
        })
        apiParams.pagenumber = 1
        this.searchListInit()
      }
    },
    // 监控搜索条件列表值的变化
    keywordArr: function (newVal, oldVal) {
      this.currentPage = 1
      this.searchListInit()
    },
    // 监听searchVal(路由参数)的变化
    searchVal: function (newVal, oldVal) {
      if (oldVal !== '' && oldVal !== newVal) {
        this.keywordArr = []
        this.keywordArr.push({
          type: 'searchVal',
          name: this.$route.params.val
        })
        apiParams.querytype = this.searchType
        apiParams.query = newVal
        apiParams.pagenumber = 1
        this.searchListInit()
      }
    },

    searchType: function (newVal, oldVal) {
      this.currentPage = 1
      apiParams.querytype = newVal
      apiParams.query = this.searchVal
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
    // 去人物信息页
    toDetail (val) {
      let routeUrl = this.$router.resolve({
        path: '/detail/' + val
      })
      window.open(routeUrl.href, '_blank') // 重开标签页
    },

    // 排序中按相关度右侧箭头的变化
    iconChange (isOpen) {
      return 'el-icon-plus'
    },

    // 树形插件点击事件
    handleNodeClick () {
      apiParams.pagenumber = 1
      paramsMap[arguments[1]](arguments[0])
      this.addKeyword(arguments[1], arguments[0].name)
      this.searchListInit()
    },

    // 滚动条体验优化
    goTop () {
      // 重置一下元素
      document.querySelectorAll('.otherInfo ').forEach((item) => {
        item.style.cssText = ''
      })
      document.querySelectorAll('.hide_c ').forEach((item) => {
        item.style.cssText = ''
      })
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let index = 1
      let timer = setInterval(() => {
        document.querySelector('html').scrollTop -= scrollTop / 20
        index++
        if (index === 21) { clearInterval(timer) }
      }, 10)
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
    // 用于判断此关键字是否已经添加过
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
      if (val.type === 'searchVal') { // 第一个标签删除则后面全清空
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
      }
      this.searchListInit()
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
      this.searchListInit()
    },
    // 相关搜索
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
      this.searchListInit()
    },
    // 分页当前页改变触发
    currentChange (val) {
      apiParams['pagenumber'] = val
      this.currentPage = val
      this.searchListInit()
    },
    // 去异常页
    goAbnormalPage (key, val) {
      let routeUrl = {
        abnormalDynamic: this.$router.resolve({ path: `/detail/${val}/dynamic` }),
        abnormalRelation: this.$router.resolve({ path: `/detail/${val}/relationship` }),
        abnormalTrail: this.$router.resolve({ path: `/detail/${val}/peoplePath` })
      }
      window.open(routeUrl[key].href, '_blank')
    },
    // 按相关度排序方式的变化
    sortChange () {
      this.currentPage = 1
      if (this.sortFlag === 'desc') {
        this.sortFlag = 'asc'
      } else if (this.sortFlag === 'asc') {
        this.sortFlag = 'desc'
      }
      apiParams.order = this.sortFlag
      this.searchListInit()
    },
    // 搜索结果列表初始化
    searchListInit () {
      apiParams['pagenumber'] = 1
      getListData(apiParams).then(res => {
        this.treeData = res.data.result_tree || {}
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
    apiParams['query'] = this.$route.params.val
    apiParams['querytype'] = this.$route.params.type
    this.searchListInit()
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
