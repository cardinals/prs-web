<template>
  <div class="dynamic">
    <!-- 异常信息通知 -->
    <div class="msg" v-if="$route.params.type!=='err' && showMsg && dynamicNum !== '0'">
      <div class="icon"></div>
      <div class="text" >
        {{peopleName}}共有<span>{{dynamicNum}}</span>项<span>异常动态</span>风险预警
      </div>
      <div class="btn" @click="onlyDanger"><span>点击查看</span></div>
      <div class="del" @click="changeShowMsg(false)"></div>
    </div>
    <!-- 活动及风险类型 -->
    <div class="type">
      <!-- 活动类型 -->
      <div class="activeType" ref="activeType">
        <div class="name">
          活动类型:
        </div>
        <div class="noData" v-if="allData.huodonglx.length === 0">
          暂无活动
        </div>
        <div class="items" ref="items1">
          <span v-for="(item, index) in allData.huodonglx" :key="index" :class="{'checked':index === activeChecked}" @click="huodonglxChange(index, item.name)">
            {{item.name}}({{item.value}})
          </span>
        </div>
        <div class="openRetract" @click="openActiveType" v-if="allData.huodonglx.length > 4">
          <span v-if="!isOpen_active">展开</span>
          <span v-if="isOpen_active">收起</span>
          <i class="el-icon-arrow-down" :class="{'rotate': isOpen_active}"></i>
        </div>
      </div>
      <!-- 风险类型 -->
      <div class="dangerType" >
        <div class="name">
          风险类型:
        </div>
        <div class="noData" v-if="allData.fengxianlx.length === 0">
          暂无风险
        </div>
        <span class="filter" v-if="dangerChecked >= 0" @click="filterControl(-1)">取消过滤</span>
        <div class="items" ref="items" >
          <div class="container" ref="dangerType" >
            <span v-for="(item, index) in allData.fengxianlx" :key="index" :class="{'checked':index === dangerChecked}" @click="filterControl(index, item.name)">
              {{item.name}}({{item.value}})
            </span>
          </div>
        </div>
        <div class="openRetract" @click="openDangerType" v-if="allData.fengxianlx.length > 4">
          <span v-if="!isOpen_danger">展开</span>
          <span v-if="isOpen_danger">收起</span>
          <i class="el-icon-arrow-down" :class="{'rotate': isOpen_danger}"></i>
        </div>
      </div>
    </div>
    <!-- 人员动态内容展示 -->
    <div class="peopleDynamic">
      <div class="title">
        <span class="name">人员动态</span>
        <dateCheck @dateReturn="dateReturn" :dateDefault="dateDefault" />
      </div>
      <div class="content">
        <div class="resultTable">
          <el-table :data="allData.activitylist" :cell-style="dangerColor">
            <el-table-column prop="shijian" label="时间"/>
            <el-table-column prop="leixing" label="类型"/>
            <el-table-column prop="miaoshu" label="描述" width="285" />
            <el-table-column prop="fengxianyj" label="风险预警"  />
          </el-table>
        </div>
        <div class="page" v-if="allData.resultNum > 8">
          <el-pagination
            layout="prev, pager, next"
            :page-size="8"
            :total="allData.resultNum"
            @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDynamic } from '@/api/api.js'
import { mapActions } from 'vuex'
// api参数
let apiParams = {}
// 获得基于今日往前若干天或往后若干天的日期
export default {
  name: 'dynamic',
  data () {
    return {
      isOpen_active: false, // 活动类型是否展开
      isOpen_danger: false, // 风险类型是否展开
      allData: { fengxianlx: [], huodonglx: [] }, // 页面数据
      activeChecked: 0, // 活动类型选择
      dangerChecked: -1, // 风险类型选择
      dateDefault: '本年', // 默认日期选择
      dataPicked: [], // 日期选择器绑定数值
      currentPage: 1, // 当前页码
      firstLoad: true // 是否第一次加载
    }
  },
  computed: {
    // 是否展示最上方的消息提示
    showMsg () {
      return this.$store.state.dynamic.showMsg
    },
    dynamicNum () {
      return this.$store.state.dynamic.dynamicNum
    },
    peopleName () {
      return this.$store.state.dynamic.peopleName
    },
    fengxianlx () {
      return this.allData.fengxianlx
    }
  },
  methods: {
    ...mapActions('dynamic', {
      changeShowMsg: 'changeShowMsg',
      changeHeight: 'changeHeight'
    }),
    // 活动类型展开与收起
    openActiveType () {
      this.isOpen_active = !this.isOpen_active
      if (this.isOpen_active) {
        this.$refs.activeType.style.height = this.$refs.items1.scrollHeight + 'px'
      } else {
        this.$refs.activeType.style.height = '62px'
      }
    },
    // 风险类型展开与收起
    openDangerType () {
      this.isOpen_danger = !this.isOpen_danger
      if (this.isOpen_danger) {
        this.$refs.items.style.height = this.$refs.dangerType.scrollHeight + 'px'
      } else {
        this.$refs.items.style.height = '62px'
      }
    },
    // 取消过滤相关操作
    filterControl (val, type) {
      this.dangerChecked = val
      if (val === -1) {
        apiParams.flag = '1'
        apiParams.fengxianlx = ''
        if (type !== 'noRequest') this.getDynamic()
      } else if (val === 0) {
        apiParams.flag = '2'
        apiParams.fengxianlx = 'unnormal'
        this.getDynamic()
      } else {
        apiParams.flag = '2'
        apiParams.fengxianlx = type
        this.getDynamic()
      }
      if (this.isOpen_danger) {
        let _this = this
        if (val >= 0) {
          this.changeHeight(this.$refs.dangerType.clientHeight)
          this.$nextTick(() => {
            _this.$refs.items.style.height = _this.$refs.dangerType.clientHeight + 'px'
          })
        } else {
          this.$nextTick(() => {
            _this.$refs.items.style.height = _this.$store.state.dynamic.dangerContentHeight + 'px'
          })
        }
      }
    },
    // 底部表格中若是信息为异常信息则改变相应区域的颜色
    dangerColor ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && this.allData.activitylist[rowIndex].fengxianyj !== '正常') {
        return 'color: rgba(255,169,83,1)'
      }
    },
    // 仅显示异常
    onlyDanger () {
      this.changeShowMsg(false)
      apiParams.flag = '2'
      this.dateDefault = '全部'
      apiParams.timestart = 'all'
      getDynamic(apiParams).then(res => {
        this.allData = res.data
        if (this.allData.fengxianlx.length !== 0) {
          this.dangerChecked = 0
        }
      })
    },
    // 活动类型改变相关操作
    huodonglxChange (index, type) {
      this.activeChecked = index
      if (index === 0) {
        apiParams.huodonglx = ''
      } else {
        apiParams.huodonglx = type
      }
      this.getDynamic()
    },
    // 请求接口数据
    getDynamic () {
      apiParams.pagenumber = 1
      getDynamic(apiParams).then(res => {
        this.allData = res.data
      })
    },
    // 点击页码重新请求数据
    currentChange (val) {
      apiParams.pagenumber = val
      getDynamic(apiParams).then(res => {
        this.allData = res.data
      })
    },
    // 时间选择器组件返回的当前选取的时间值
    dateReturn (date) {
      this.dataPicked = date
    },
    // 初始化接口参数，请求数据
    init () {
      apiParams.g_id = this.$route.params.personId
      apiParams.timeend = this.dataPicked[1]
      apiParams.pagecapacity = 8
      apiParams.pagenumber = 1
      apiParams.huodonglx = ''
      apiParams.fengxianlx = ''
      if (this.$route.params.type === 'err') {
        apiParams.flag = '2'
        apiParams.timestart = 'all'
        this.dateDefault = '全部'
        this.dangerChecked = 0
      } else {
        apiParams.flag = '1'
        this.dangerChecked = -1
        apiParams.timestart = new Date().getFullYear() + '-01-01'
      }
      this.getDynamic()
    }
  },
  watch: {
    // 监控时间选择器的日期变化
    dataPicked (newVal, oldVal) {
      apiParams.timestart = newVal[0] === '1919-01-01' ? 'all' : newVal[0]
      apiParams.timeend = newVal[1]
      apiParams.flag = this.$route.params.type === 'err' ? '2' : '1'
      apiParams.huodonglx = ''
      apiParams.fengxianlx = ''
      apiParams.pagenumber = 1
      if (!this.firstLoad) {
        this.getDynamic()
      } else {
        this.firstLoad = false
      }
    },
    // 监控风险类型的变化
    fengxianlx (newVal, oldVal) {
      if (oldVal && oldVal.length !== 0 && (newVal !== oldVal) && (newVal.length === 0)) {
        this.filterControl(-1, 'noRequest')
      }
    },
    // 监控路由变化
    $route: {
      handler: function (val, oldVal) {
        if (val.params.type === 'err') {
          this.dateDefault = '全部'
        } else {
          this.dateDefault = '本年'
        }
        this.init()
      },
      deep: true
    }
  },
  mounted () {
    this.dateDefault = this.$route.params.type === 'err' ? '全部' : '本年'
    this.init()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/css/peopleDynamic.less';
</style>
<style lang="less">
.el-date-editor .el-range-separator {
  width: 10%;
}
.el-date-editor.el-input__inner {
  width: 250px !important;
  height: 28px;
  .el-input__icon, .el-range-separator {
    line-height: 20px;
  }
}

.el-table__header-wrapper {
  .has-gutter {
    tr, th{
      background: rgba(245,245,245,1);
      .cell {
        color:rgba(57,57,57,1);
        font-size:16px;
      }
    }
  }
}

</style>
