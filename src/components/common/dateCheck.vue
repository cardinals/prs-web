<template>
  <div class="dateCheck">
    <div class="dateSelect">
      <span :class="{'checked': dateDefaultCheck === '全部'}" @click="dateChange('全部')" v-if="isShowButtton('全部')">全部</span>
      <span :class="{'checked': dateDefaultCheck === '今日'}" @click="dateChange('今日')" v-if="isShowButtton('今日')">今日</span>
      <span :class="{'checked': dateDefaultCheck === '本周'}" @click="dateChange('本周')" v-if="isShowButtton('本周')">本周</span>
      <span :class="{'checked': dateDefaultCheck === '本月'}" @click="dateChange('本月')" v-if="isShowButtton('本月')">本月</span>
      <span :class="{'checked': dateDefaultCheck === '本年'}" @click="dateChange('本年')" v-if="isShowButtton('本年')">本年</span>
    </div>
    <div class="datePicker">
      <el-date-picker
        v-model="datePicked"
        format="yyyy/M/d"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="dateChanged"
        >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
let getDay = day => {
  let today = new Date()
  let targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetdayMilliseconds)
  let mm = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1)
  let dd = today.getDate() >= 10 ? today.getDate() : '0' + today.getDate()
  return today.getFullYear() + '-' + mm + '-' + dd
}

export default {
  name: 'dateCheck',
  props: {
    buttons: {
      type: Array,
      default: () => {
        return ['全部', '今日', '本周', '本月', '本年']
      }
    },
    dateDefault: {
      type: String,
      default: '本年'
    }
  },
  data () {
    return {
      dateDefaultCheck: '',
      datePicked: [],
      dateMap: {
        '全部': () => {
          this.datePicked = []
          this.datePicked.push(new Date().getFullYear() - 100 + '-01-01')
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          this.datePicked.push(new Date().getFullYear() + '-' + month + '-' + day)
        },
        '今日': () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          let timestart = year + '-' + month + '-' + day
          let timeend = year + '-' + month + '-' + day
          this.datePicked = []
          this.datePicked.push(timestart)
          this.datePicked.push(timeend)
        },
        '本周': () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          let timestart = getDay(-new Date().getDay() + 1)
          let timeend = year + '-' + month + '-' + day
          this.datePicked = []
          this.datePicked.push(timestart)
          this.datePicked.push(timeend)
        },
        '本月': () => {
          let year = new Date().getFullYear()
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          // apiParams.timestart = getDay(-30)
          let timestart = year + '-' + month + '-01'
          let timeend = year + '-' + month + '-' + day
          this.datePicked = []
          this.datePicked.push(timestart)
          this.datePicked.push(timeend)
        },
        '本年': () => {
          let month = (new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
          let day = new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
          let timestart = new Date().getFullYear() + '-01-01'
          let timeend = new Date().getFullYear() + '-' + month + '-' + day
          this.datePicked = []
          this.datePicked.push(timestart)
          this.datePicked.push(timeend)
        }
      }
    }
  },
  methods: {
    dateChange (val) {
      this.dateDefaultCheck = val
      this.dateMap[val]()
      this.dateChanged(this.datePicked)
      // this.getDynamic()
    },
    isShowButtton (val) {
      let res = false
      this.buttons.forEach(element => {
        if (element === val) {
          res = true
        }
      })
      return res
    },
    dateChanged (val) {
      this.$emit('dateReturn', val)
    }
  },
  watch: {
    dateDefault (newVal, oldVal) {
      console.log(newVal)
      this.dateChange(newVal)
    }
  },
  mounted () {
    this.dateChange(this.dateDefault)
  }
}
</script>
<style lang="less">
.dateCheck {
  display: flex;
  .dateSelect {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    margin-right: 40px;
    span {
      border: 1px solid rgba(237,237,237,1);
      line-height: 25px;
      color:rgba(0,0,0,0.65);
      padding: 0 9px;
      border-right: 0;
      cursor: pointer;
      &:last-child {
        border-right: 1px solid rgba(237,237,237,1);
        border-radius: 0 2px 2px 0;
      }
      &:first-child {
        border-radius: 2px 0 0 2px;
      }
      &.checked {
        border-color: #1890FF;
        color:rgba(24,144,255,1);
      }
      &.checked+span {
        border-left-color: #1890FF;
      }
      &:hover {
        border-color: #1890FF;
        color:rgba(24,144,255,1);
      }
      &:hover+span {
        border-left-color: #1890FF;
      }
    }
  }
  .dateSelect {
    justify-self: end;
  }
}

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
