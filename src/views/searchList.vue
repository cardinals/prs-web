<template>
  <div class="searchList">
    <!-- 搜索条件标签栏 -->
    <div class="searchCondition clearfix">
      <div class="label">搜索条件:</div>
      <transition-group name="rotate">
        <div class="buttons" v-for="(value, index) in keywordArr" :key="`button${index}`">
          <span :class="value.type" class="typeIcon"></span>
          <span class="span" :class="{'firstTag': value.type ==='searchVal'}">{{value.name|cantOver}}</span>
          <span class="iconx" v-if="value.type !=='searchVal'" @click="deleteKeyword(value)" >×</span>
        </div>
      </transition-group>
      <div @click="resetAll" class="reset" v-if="keywordArr.length!==0">重置条件</div>
    </div>

    <!-- 相关搜索 -->
    <div v-if="true" class="searchCondition">
      <span class="label">相关搜索</span>
      <span class="searchTags" v-for="(item, index) in treeData.aboutSearch" :key="index" @click="goAboutSearch(item)" :title="item">
        {{item|aboutSearchFilter}}
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
            <span>按相关度 <i class="el-icon-download"></i></span>
          </div>
          <div class="num" v-if='listData !== null'>共找到 <span style="color:#2770EE">{{listData.resultNum}}</span> {{resultNumUnit}}</div>
        </div>
        <div v-if ="listData !== null">
          <div class="resultList" v-for="(item,index) in listData.pageContent" :key="index" >
            <div class="card">
              <div class="peopleInfo">
                <div class="photo" @click="toDetail(item); log(item)">
                  <div :class="{'man': item.gender === '男性', 'women': item.gender === '女性', 'unknow': item.gender === '未知'}" v-if="true"></div>
                </div>
                <div class="info">
                  <div class="line1">
                    <span class="name" @click="toDetail(item); log(item)" :title="item.name"> {{ item.name|nameFilter }}</span>
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
                <div class="abnormalContent"  @click="goAbnormalPage('abnormalDynamic', item.personId); log(item)">
                  <div class="img trend"></div>
                  <span>异常动态:</span>
                  <span>{{item.abnormalDynamic}} 项</span>
                </div>
                <div class="abnormalContent"  @click="goAbnormalPage('abnormalTrail', item.personId); log(item)">
                  <div class="img path"></div>
                  <span>异常轨迹:</span>
                  <span>{{item.abnormalTrail}}项</span>
                </div>
                <div class="abnormalContent"  @click="goAbnormalPage('abnormalRelation', item.personId); log(item)">
                  <div class="img relationship"></div>
                  <span>异常关系:</span>
                  <span>{{item.abnormalRelation}}项</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="nodataImg" v-if="listData !==null && (listData.resultNum === 0 || listData.length === 0)">根据搜索条件未匹配到相应结果</div>
        <el-pagination
            v-if='listData.resultNum>0'
            class="page"
            layout="total, prev, pager, next, jumper"
            :total="listData.resultNum"
            :page-size="5"
            :current-page="currentPage"
            @current-change="currentChange"
            >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getListData, queryLogs } from '@/api/api.js'

import changePage from '@/components/mixins/changePage'

// 树状列表名称映射
const treeTitleMap = {
  gender: '性别',
  age: '年龄分布',
  birthPlace: '籍贯',
  homeAddress: '居住地',
  tags: '标签'
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
      renderList: [], // 实际渲染列表
      pageChange: false, // 是否改变页码

      // 接口请求参数
      apiParams: {
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
      },
      // 点击树状节点对应的api参数修改方式映射
      paramsMap: {
        age: (val) => { this.apiParams['age'] = val.name },
        birthPlace: (val) => { this.apiParams['hujidizhi'] = val.nameid },
        homeAddress: (val) => { this.apiParams['juzhudi'] = val.nameid },
        tags: (val) => {
          if (this.apiParams['label'].indexOf(val.name) < 0) {
            if (val.type === 'jiaozhengjibie' || val.type === 'jiangchengleixing' || val.type === 'jiaozhengleixing' || val.type === 'pingjia' || val.type === 'fengxiandengji') {
              this.apiParams['label'].push(val.name.split(':')[1])
            } else {
              this.apiParams['label'].push(val.name)
            }
          }
        },
        gender: (val) => { this.apiParams['xingbie'] = val.nameid }
      },
      // 删除搜索条件对应的api参数修改方式映射
      delParamsMap: {
        age: (val) => { this.apiParams['age'] = '' },
        birthPlace: (val) => { this.apiParams['hujidizhi'] = '' },
        homeAddress: (val) => { this.apiParams['juzhudi'] = '' },
        gender: (val) => { this.apiParams['xingbie'] = '' },
        tags: (val) => { this.apiParams['label'].splice(this.apiParams['label'].indexOf(val), 1) }
      }
    }
  },
  mixins: [changePage.getMixin()],
  computed: {
    searchVal () {
      return this.$route.params.searchVal
    },
    searchType () {
      return this.$route.params.searchType
    },
    // 结果列表左上角总数显示
    resultNumUnit () {
      if (this.$route.params.searchType === 'people') return '位相关人员'
      if (this.$route.params.searchType === 'case') return '件相关案件'
      if (this.$route.params.searchType === 'org') return '个相关机构'
      return null
    }
  },
  watch: {

    apiParams: {
      handler: function (newVal, oldVal) {
        this.searchListInit()
      },
      deep: true
    },
    $route: {
      handler: function (newVal, oldVal) {
        this.keywordArr = [{
          type: 'searchVal',
          name: this.$route.params.searchVal
        }]
        this.apiParamsClear()
        this.apiParams.querytype = newVal.params.searchType
        this.apiParams.query = newVal.params.searchVal
      },
      deep: true
    }
  },
  filters: {
    aboutSearchFilter (val) {
      if (val.length > 5) {
        return val.substring(0, 4) + '...'
      } else {
        return val
      }
    },
    nameFilter (val) {
      if (val.length > 5) {
        return val.substring(0, 4) + '...'
      } else {
        return val
      }
    },
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
      if (val === '') {
        return '未知'
      } else {
        return val.substring(0, 4) + '************' + val.substring(val.length - 2, val.length)
      }
    },
    nodata (val) {
      return val === '' ? '暂无' : val
    }
  },
  methods: {
    // 重置接口参数
    apiParamsClear () {
      this.apiParams = {
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
    },
    log (item) {
      queryLogs({
        querycontent: this.$route.params.searchVal,
        querytype: this.$route.params.searchType,
        g_id: item.personId,
        name: item.name
      })
    },
    // 去人物信息页
    toDetail (item) {
      let routeUrl = this.$router.resolve({
        path: '/detail/' + item.personId
      })
      window.open(routeUrl.href, '_blank') // 重开标签页
    },

    // 排序中按相关度右侧箭头的变化
    iconChange (isOpen) {
      return 'el-icon-plus'
    },

    // 树形插件点击事件
    handleNodeClick () {
      this.apiParams.pagenumber = 1
      this.paramsMap[arguments[1]](arguments[0])
      this.addKeyword(arguments[1], arguments[0])
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
    addKeyword (type, item) {
      if (this.indexOfKeywordArr(type, item) < 0) {
        this.keywordArr.push({
          type: type,
          name: item.name,
          nameid: item.nameid
        })
      } else {
        this.keywordArr[this.indexOfKeywordArr(type, item)].name = item.name
        this.keywordArr[this.indexOfKeywordArr(type, item)].nameid = item.nameid
      }
    },
    // 用于判断此关键字是否已经添加过
    indexOfKeywordArr (type, item) {
      for (let i = 0; i < this.keywordArr.length; i++) {
        if (item.nameid && this.keywordArr[i].nameid) {
          if (this.keywordArr[i].nameid.substring(0, 2) === item.nameid.substring(0, 2) && this.keywordArr[i].type === type) {
            return i
          }
        } else if (this.keywordArr[i].name === item.name && this.keywordArr[i].type === type) {
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
        this.apiParamsClear()
      } else {
        this.keywordArr.splice(this.indexOfKeywordArr(val.type, val), 1)
        if (val.name.indexOf('矫正级别:') === 0 || val.name.indexOf('矫正类型:') === 0 || val.name.indexOf('评价:') === 0 || val.name.indexOf('奖惩类型:') === 0 || val.name.indexOf('风险等级:') === 0) {
          val.name = val.name.split(':')[1]
        }
        this.delParamsMap[val.type](val.name)
      }
    },

    // 清空所有条件
    resetAll () {
      this.keywordArr.splice(1, this.keywordArr.length - 1)
      this.apiParamsClear()
      this.apiParams.querytype = this.$route.params.searchType
      this.apiParams.query = this.$route.params.searchVal
    },
    // 相关搜索
    goAboutSearch (val) {
      this.$store.commit('header/changeSearchVal', val)
      this.$router.push('/searchList/people/' + val)
      this.keywordArr[0].name = val
      this.$forceUpdate()
    },
    // 分页当前页改变触发
    currentChange (val) {
      this.apiParams['pagenumber'] = val
      this.currentPage = val
      this.pageChange = true
    },
    // 搜索结果列表初始化
    async searchListInit () {
      console.log(this.pageChange)
      if (this.pageChange) {
        this.apiParams['pagenumber'] = this.currentPage
        this.pageChange = false
      } else {
        this.apiParams['pagenumber'] = 1
        this.currentPage = 1
      }

      let res = await getListData(this.apiParams)
      this.treeData = res.data.result_tree || {}
      this.listData = res.data.result_list || null
    }
  },
  mounted () {
    this.keywordArr.push({
      type: 'searchVal',
      name: this.$route.params.searchVal
    })
    this.$store.commit('header/changeSearchType', this.$route.params.searchType)
    this.$store.commit('header/changeSearchVal', this.$route.params.searchVal)
    this.apiParams['query'] = this.$route.params.searchVal
    this.apiParams['querytype'] = this.$route.params.searchType
  }
}
</script>

<style lang="less">
  @import '~@/assets/css/searchList.less';
</style>
