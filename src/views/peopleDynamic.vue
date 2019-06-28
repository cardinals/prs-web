<template>
  <div class="dynamic">
    <!-- 异常信息通知 -->
    <div class="msg" v-if="showMsg && dynamicNum !== '0'">
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
        <div class="dataSelect">
          <span :class="{'checked': dataDefault === 'all'}" @click="dataChange('all')">全部</span>
          <span :class="{'checked': dataDefault === 'today'}" @click="dataChange('today')">今日</span>
          <span :class="{'checked': dataDefault === 'week'}" @click="dataChange('week')">本周</span>
          <span :class="{'checked': dataDefault === 'month'}" @click="dataChange('month')">本月</span>
          <span :class="{'checked': dataDefault === 'year'}" @click="dataChange('year')">今年</span>
        </div>
        <div class="dataPicker">
          <el-date-picker
            v-model="dataPicked"
            format="yyyy/M/d"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="dataChanged">
          </el-date-picker>
        </div>
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
let getDay = day => {
  let today = new Date()
  let targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetdayMilliseconds)
  let mm = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)
  let dd = today.getDate() >= 10 ? today.getDate() : '0' + today.getDate()
  return today.getFullYear() + '-' + mm + '-' + dd
}
export default {
  name: 'dynamic',
  data () {
    return {
      isOpen_active: false, // 活动类型是否展开
      isOpen_danger: false, // 风险类型是否展开
      allData: {}, // 页面数据
      activeChecked: 0, // 活动类型选择
      dangerChecked: -1, // 风险类型选择
      dataDefault: 'year', // 默认日期选择
      dataPicked: [], // 日期选择器绑定数值
      currentPage: 1,

      // 选择不同的日期选项，日期选择器发生相应的变化
      dateMap: {
        all: () => {
          apiParams.timestart = 'all'
          this.dataPicked = []
          this.dataPicked.push(new Date().getFullYear() - 100 + '/1/1')
          this.dataPicked.push(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
        },
        today: () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          apiParams.timestart = year + '-' + month + '-' + day
          apiParams.timeend = year + '-' + month + '-' + day
          this.dataPicked = []
          this.dataPicked.push(apiParams.timestart)
          this.dataPicked.push(apiParams.timeend)
        },
        week: () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          apiParams.timestart = getDay(-new Date().getDay() + 1)
          apiParams.timeend = year + '-' + month + '-' + day
          this.dataPicked = []
          this.dataPicked.push(apiParams.timestart)
          this.dataPicked.push(apiParams.timeend)
        },
        month: () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          // apiParams.timestart = getDay(-30)
          apiParams.timestart = year + '-' + month + '-01'
          apiParams.timeend = year + '-' + month + '-' + day
          this.dataPicked = []
          this.dataPicked.push(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01')
          this.dataPicked.push(apiParams.timeend)
        },
        year: () => {
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          apiParams.timestart = new Date().getFullYear() + '-01-01'
          apiParams.timeend = new Date().getFullYear() + '-' + month + '-' + day
          this.dataPicked = []
          this.dataPicked.push(apiParams.timestart)
          this.dataPicked.push(apiParams.timeend)
        }
      }
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
      } else if (val === 0) {
        apiParams.flag = '2'
        apiParams.fengxianlx = 'unnormal'
      } else {
        apiParams.flag = '2'
        apiParams.fengxianlx = type
      }
      this.getDynamic()
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
    //  日期选项改变之后重新请求数据
    dataChange (val) {
      this.dataDefault = val
      this.dateMap[val]()
      this.getDynamic()
    },
    // 仅显示异常
    onlyDanger () {
      apiParams.flag = '2'
      this.dataDefault = 'all'
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
    // 日期选择器日期改变之后的相关操作
    dataChanged (val) {
      this.dataDefault = 'hahaha'
      apiParams.timestart = val[0]
      apiParams.timeend = val[1]
      this.getDynamic()
    },
    getDynamic () {
      apiParams.pagenumber = 1
      getDynamic(apiParams).then(res => {
        this.allData = res.data
      })
    },
    currentChange (val) {
      apiParams.pagenumber = val
      getDynamic(apiParams).then(res => {
        this.allData = res.data
      })
    },
    init () {
      let nowTime = new Date()
      this.dataPicked.push(nowTime.getFullYear() + '/01/01')
      this.dataPicked.push(nowTime.getFullYear() + '/' + (nowTime.getMonth() + 1) + '/' + nowTime.getDate())
      apiParams.g_id = this.$route.params.personId
      apiParams.timeend = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate()
      apiParams.pagecapacity = 8
      apiParams.pagenumber = 1
      apiParams.huodonglx = ''
      apiParams.fengxianlx = ''
      if (this.$route.params.type === 'err') {
        apiParams.flag = '2'
        apiParams.timestart = 'all'
        this.dataDefault = 'all'
        this.dangerChecked = 0
      } else {
        apiParams.flag = '1'
        apiParams.timestart = nowTime.getFullYear() + '-01-01'
      }
      this.getDynamic()
    }
  },
  watch: {
    fengxianlx (newVal, oldVal) {
      if (oldVal.length !== 0 && (newVal !== oldVal) && (newVal.length === 0)) {
        this.filterControl(-1)
      }
    },
    $route: {
      handler: function (val, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  mounted () {
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
