<template>
  <div class="searchList">
    <div class="searchCondition clearfix">
      <div class="label">搜索条件:</div>
      <transition-group name="rotate">
        <div class="buttons" v-for="(item,index) in keywordArr" :key="index">
          <span class="span">{{item.val|cantOver}}</span>
          <span class="iconx" @click="deleteKeyword(item)">×</span>
        </div>
      </transition-group>
      <div @click="resetAll" class="reset" v-if="keywordArr.length!==0">重置条件</div>
    </div>
    <!-- 相关搜索暂时不要 -->
    <div v-if="false" class="searchCondition">
      <div class="label">相关搜索:</div>
      <div class="span2">婚姻家庭</div>
      <div class="span2">公积金住房</div>
      <div class="span2">住房赡养</div>
    </div>
    <div class="treeList clearfix">
      <!-- 案件分类 和 关键词 -->
      <div class="tree">
        <div class="classify">
          <div class="titles">
            <div class="img"></div>
            <span>案件分类</span>
          </div>
          <el-tree
           class="main"
           :data="treeData"
           :props="defaultProps"
           @node-click="handleNodeClick"
           highlight-current
           :expand-on-click-node="false"
          ></el-tree>
        </div>
        <div class="keyword">
          <div class="titles">
            <div class="img"></div>
            <span>关键词</span>
          </div>
          <div class="main">
            <div @click="addKeyword(item)" class="once" v-for="(item,index) in keywordAggs" :key="index">
              <i class="circle"></i>
              <span class="">{{item.name + '(' + item.value + ')'}}</span>
            </div>
            <div class="no-data" v-if="keywordAggs.length===0">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- 右边列表 -->
      <div class="list">
        <div class="others">
          <div class="label">排序:</div>
          <div class="sort" :class="{'active':sortFlag==='score'}">
            <span @click="sortFlag='score'">按相关度</span>
            <i class="el-icon-download"></i>
          </div>
          <div class="sort" :class="{'active':sortFlag==='date'}">
            <span @click="sortFlag='date'">按时间</span>
            <i class="el-icon-download"></i>
          </div>
          <div class="echarts">
            <div class="img"></div>
            <span>类案分析</span>
          </div>
          <div class="num">共{{pageTotal}}篇</div>
        </div>
        <div class="once" v-for="(item,index) in renderList" :key="index">
          <div class="main">
            <div class="titles">
              <span @click="openUrl('mediationCaseDetails',item.dissensionId)" v-if="searchType==='mediateCase'" v-html="keywords(item.title)"></span>
              <span @click="openUrl('mediationAgreementDetail',item.protocolId)" v-if="searchType==='protocol'" v-html="keywords(item.title)"></span>
              <span @click="openUrl('judgmentDocumentDetail',item.caseId)" v-if="searchType==='judgement'" v-html="keywords(item.title)"></span>
              <span @click="openUrl('lawsDetail',item.number)" v-if="searchType==='law'" abc="law" v-html="keywords(item.lawItem)"></span>
            </div>
            <div class="infos clearfix">
              <span class="span">{{item.class}}</span>
              <i class="border"></i>
              <span v-if="searchType==='mediateCase'" class="span">{{item.refereeDept|changeNull}}</span>
              <span v-if="searchType==='protocol'" class="span">{{item.refereeDept|changeNull}}</span>
              <span v-if="searchType==='judgement'" class="span">{{item.courtName|changeNull}}</span>
              <span v-if="searchType==='law'" class="span">{{item.publisher|changeNull}}</span>
              <i class="border"></i>
              <span v-if="searchType==='mediateCase'" class="span">{{item.transactDate|changeNull}}</span>
              <span v-if="searchType==='protocol'" class="span">{{item.dateaccepted|changeNull}}</span>
              <span v-if="searchType==='judgement'" class="span">{{item.trialDate|changeNull}}</span>
              <span v-if="searchType==='law'" class="span">{{item.enforceDate|changeNull}}</span>
            </div>
            <div class="details" v-if="searchType==='mediateCase'">
              <div class="line1">【案件详情】</div>
              <div class="line2" v-html="keywords(item.mediateCircs)"></div>
            </div>
            <div class="details" v-if="searchType==='protocol'">
              <div class="line1">【简要情况】</div>
              <div class="line2" v-html="keywords(item.dealdispute)"></div>
            </div>
            <div class="details" v-if="searchType==='judgement'">
              <div class="line1">【判决理由】</div>
              <div class="line2" v-html="keywords(item.caseContent)"></div>
            </div>
            <div class="details" v-if="searchType==='law'">
              <div class="line2" v-html="keywords(item.content)"></div>
            </div>
            <div class="types" v-if="searchType==='mediateCase'">调解案例</div>
            <div class="types types2" v-if="searchType==='protocol'">调解协议书</div>
            <div class="types types3" v-if="searchType==='judgement'">裁判文书</div>
             <div class="types types4" v-if="searchType==='law'">法律法规</div>
          </div>
          <!-- 案件详情适配 -->
          <div class="otherInfo clearfix" v-if="searchType==='mediateCase'">
            <div class="buttons" @click="showDom($event,'law',item.dissensionId)" :class="{'active':state==='law'&& dissensionId === item.dissensionId}">适用法条推荐</div>
            <div class="buttons" @click="showDom($event,'judgement',item.dissensionId)" :class="{'active':state==='judgement'&& dissensionId === item.dissensionId}">类案裁判文书</div>
            <div class="buttons" @click="showDom($event,'protocol',item.dissensionId)" :class="{'active':state==='protocol'&& dissensionId === item.dissensionId}">类案调解协议</div>
          </div>
          <div class="hide_c" :ref="item.dissensionId" v-if="searchType==='mediateCase'">
            <div class="hideBlock" :class="{'delt1':state==='law'&& dissensionId === item.dissensionId,'delt2':state==='judgement'&& dissensionId === item.dissensionId,'delt3':state==='protocol'&& dissensionId === item.dissensionId,'active':state}">
              <!-- 法条 -->
              <div v-show="state==='law'" v-for="(item,index) in law" :key="index" class="once_h">
                <div class="title1" @click="openUrl('lawsDetail',item.number)"><div class="rect"></div>{{item.lawItem}}</div>
                <div class="contents" v-html="keywords(item.content)"></div>
              </div>
              <!-- 裁判文书 -->
              <div v-show="state==='judgement'" v-for="item in judgement" :key="item.caseId" class="once_h">
                <div class="title1"  @click="openUrl('judgmentDocumentDetail',item.caseId)"><div class="rect"></div>{{item.title}}</div>
                <div class="title2">【判决理由】</div>
                <div class="contents" v-html="keywords(item.trialReason)"></div>
              </div>
              <!-- 类案协议 -->
              <div v-show="state==='protocol'" v-for="item in protocol" :key="item.protocolId" class="once_h">
                <div class="title1" @click="openUrl('mediationAgreementDetail',item.protocolId)"><div class="rect"></div>{{item.title}}</div>
                <div class="title2">【案件详情】</div>
                <div class="contents" v-html="keywords(item.dealdispute)"></div>
              </div>
            </div>
          </div>
          <!-- 调解协议适配 -->
          <div class="otherInfo clearfix"  v-if="searchType==='protocol'">
            <div class="buttons" @click="showDom($event,'law',item.protocolId)" :class="{'active':state==='law'&& dissensionId === item.protocolId}">适用法条推荐</div>
            <div class="buttons" @click="showDom($event,'judgement',item.protocolId)" :class="{'active':state==='judgement'&& dissensionId === item.protocolId}">类案裁判文书</div>
            <div class="buttons" @click="showDom($event,'mediateCase',item.protocolId)" :class="{'active':state==='mediateCase'&& dissensionId === item.protocolId}">相似调解案例</div>
          </div>
          <div class="hide_c" :ref="item.protocolId" v-if="searchType==='protocol'">
            <div class="hideBlock" :class="{'delt1':state==='law'&& dissensionId === item.protocolId,'delt2':state==='judgement'&& dissensionId === item.protocolId,'delt3':state==='mediateCase'&& dissensionId === item.protocolId,'active':state}">
              <!-- 法条 -->
              <div v-show="state==='law'" v-for="(item,index) in law" :key="index" class="once_h">
                <div class="title1" @click="openUrl('lawsDetail',item.number)"><div class="rect"></div>{{item.lawItem}}</div>
                <div class="contents" v-html="keywords(item.content)"></div>
              </div>
              <!-- 裁判文书 -->
              <div v-show="state==='judgement'" v-for="item in judgement" :key="item.caseId" class="once_h">
                <div class="title1"   @click="openUrl('judgmentDocumentDetail',item.caseId)"><div class="rect"></div>{{item.title}}</div>
                <div class="title2">【判决理由】</div>
                <div class="contents" v-html="keywords(item.trialReason)"></div>
              </div>
              <!-- 相似调解案例 -->
              <div v-show="state==='mediateCase'" v-for="item in mediateCase" :key="item.dissensionId" class="once_h">
                <div class="title1" @click="openUrl('mediationCaseDetails',item.dissensionId)"><div class="rect"></div>{{item.title}}</div>
                <div class="title2">【案件详情】</div>
                <div class="contents" v-html="keywords(item.mediateCircs)"></div>
              </div>
            </div>
          </div>
          <!-- 裁判文书适配 -->
          <div class="otherInfo clearfix" v-if="searchType==='judgement'">
            <div class="buttons" @click="showDom($event,'law',item.caseId)" :class="{'active':state==='law'&& dissensionId === item.caseId}">适用法条推荐</div>
            <div class="buttons" @click="showDom($event,'judgement',item.caseId)" :class="{'active':state==='judgement'&& dissensionId === item.caseId}">类案裁判文书</div>
          </div>
          <div class="hide_c" :ref="item.caseId" v-if="searchType==='judgement'">
            <div class="hideBlock" :class="{'delt1':state==='law'&& dissensionId === item.caseId,'delt2':state==='judgement'&& dissensionId === item.caseId,'delt3':state==='mediateCase'&& dissensionId === item.caseId,'active':state}">
              <!-- 法条 -->
              <div v-show="state==='law'" v-for="(item,index) in law" :key="index" class="once_h">
                <div class="title1" @click="openUrl('lawsDetail',item.number)"><div class="rect"></div>{{item.lawItem}}</div>
                <div class="contents" v-html="keywords(item.content)"></div>
              </div>
              <!-- 裁判文书 -->
              <div v-show="state==='judgement'" v-for="item in judgement" :key="item.caseId" class="once_h">
                <div class="title1"  @click="openUrl('judgmentDocumentDetail',item.caseId)"><div class="rect"></div>{{item.title}}</div>
                <div class="title2">【判决理由】</div>
                <div class="contents" v-html="keywords(item.trialReason)"></div>
              </div>
            </div>
          </div>
          <!-- 法律条文适配 -->
          <div class="law_keyword clearfix" v-if="searchType==='law'&&item.keyword!==''">
            <span class="keyword" v-for="(keyword,index) in arrToString(item.keyword).slice(0,3)" :key="index">{{keyword}}</span>
          </div>
        </div>
        <div class="nodataImg" v-if="renderList.length===0">根据搜索条件未匹配到相应结果</div>
        <div v-if="renderList.length!==0" class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5,10,20]"
            :page-size="pageSize"
            :current-page ="currentPage"
            layout="sizes, prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchList, recommendList, log } from '@/api/api.js'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      state: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      caseType: '',
      caseTypeId: '',
      keyword: [],
      sortFlag: 'score',
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
      keyRex: []
    }
  },
  computed: {
    ...mapState('header', {
      searchVal: state => state.searchVal,
      searchType: state => state.searchType
    }),
    keywordArr () {
      let arr = []
      if (this.searchVal !== '') {
        arr.push({
          type: 'searchVal',
          val: this.searchVal
        })
      } else {
        // 如果searchVal为空，清空所有搜索条件
        this.resetAll()
      }
      if (this.caseType !== '') {
        arr.push({
          type: 'caseType',
          val: '案件分类:' + this.caseType,
          name: this.caseType
        })
      }
      if (this.keyword.length !== 0) {
        this.keyword.map((item) => {
          arr.push({
            type: 'keyword',
            val: '关键词:' + item,
            name: item
          })
        })
      }
      return arr
    }
  },
  watch: {
    // 监控跟搜索有关的参数
    keywordArr: function (newVal, oldVal) {
      this.currentPage = 1
      this.searchListInit()
    },
    searchVal: function (newVal, oldVal) {
      if (oldVal !== '' && oldVal !== newVal) {
        // this.$router.push('/searchList/' + this.searchType + '/' + newVal)
        // this.$store.commit('header/changeSearchVal', newVal)
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
    sortFlag: function (newVal, oldVal) {
      this.currentPage = 1
      this.searchListInit()
    },
    searchType: function (newVal, oldVal) {
      this.currentPage = 1
      if (oldVal !== newVal) {
        this.caseType = ''
        this.keyword = []
      }
    }
  },
  filters: {
    changeNull (val) {
      return !val ? '暂无信息' : val
    },
    // 限定字数不能超过10
    cantOver (val) {
      return val.length > 11 ? val.slice(0, 10) + '...' : val
    }
  },
  methods: {
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
    handleNodeClick (data) {
      this.caseType = data.realName
      this.caseTypeId = data.id
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
    addKeyword (val) {
      if (val.value !== 0 && this.keyword.indexOf(val.name) === -1) {
        this.keyword.push(val.name)
      } else if (this.keyword.indexOf(val.name) !== -1) {
        this.showMessage('请不要重复选取关键词', 'warning')
      } else if (val.value === 0) {
        this.showMessage('找不到该关键词的搜索结果', 'warning')
      }
    },
    // 删除关键词
    deleteKeyword (val) {
      if (val.type === 'searchVal') {
        this.$store.commit('header/changeSearchVal', '')
      } else if (val.type === 'caseType') {
        this.caseType = ''
        this.caseTypeId = ''
      } else if (val.type === 'keyword') {
        this.keyword.splice(this.keyword.indexOf(val.name), 1)
      }
    },
    // 清空所有条件
    resetAll () {
      this.$store.commit('header/changeSearchVal', '')
      this.caseType = ''
      this.caseTypeId = ''
      this.keyword = []
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
    }
  },
  mounted () {
    // 优化刷新网页的时候状态丢失
    this.$store.commit('header/changeSearchType', this.$route.params.type)
    this.$store.commit('header/changeSearchVal', this.$route.params.val)
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
  .el-pager{
    .number{
      background-color: #ffffff!important;
    }
    .active{
      background-color: #669AFF!important;
    }
  }
  .el-pagination button{
    background-color:#ffffff!important;
  }
  .el-tree-node__expand-icon{
    color:#808080;
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
  .el-tree-node__content{
    &:hover{
      .el-tree-node__expand-icon{
        color:#669AFF;
      }
      .el-tree-node__expand-icon.is-leaf{
        background: #669AFF;
      }
      color:#669AFF;
      background: rgb(240,240,240)
    }
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background: rgb(240,240,240);
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
</style>

<style lang="less" scoped>
  @import '~@/assets/css/searchList.less';
</style>
