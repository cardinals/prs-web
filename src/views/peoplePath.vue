<template>
  <div class="peoplePath">
    <div class="msg" v-if="showMsg && dynamicNum !== '0'">
      <div class="icon"></div>
      <div class="text" >
        {{peopleName}}共有<span>{{dynamicNum}}</span>项<span>异常关系</span>风险预警
      </div>
      <div class="btn" @click="onlyDanger"><span>点击查看</span></div>
      <div class="del" @click="changeShowMsg(false)"></div>
    </div>
    <div class="mapContainer">
      <div class="title">
        <span class="name">时空轨迹</span>
        <dateCheck @dateReturn="dateReturn" :dateDefault="dateDefault" />
      </div>
      <div class="pathMap"></div>
    </div>
    <div class="tableContainer">
      <div class="title">
        <span class="name">轨迹清单</span>
      </div>
      <div class="pathTable">
        <el-table :data="pathData.list" :cell-style="dangerColor">
          <el-table-column prop="time" label="时间" />
          <el-table-column prop="address" label="地点" width="300"/>
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="label" label="风险预警"  />
        </el-table>
        <div class="page" v-if="pathData.resultNum > 5">
          <el-pagination
            layout="prev, pager, next"
            :page-size="5"
            :total="pathData.resultNum"
            @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { personTrajectory } from '@/api/api.js'
let apiParams = {}
export default {
  name: 'peoplePath',
  data () {
    return {
      dateDefault: '本年',
      pathData: {
      },
      nowDate: [],
      maptype: 'points'
    }
  },
  computed: {
    showMsg () {
      return this.$store.state.path.showMsg
    },
    dynamicNum () {
      return this.$store.state.path.dynamicNum
    },
    peopleName () {
      return this.$store.state.path.peopleName
    }
  },
  methods: {
    ...mapActions('dynamic', {
      changeShowMsg: 'changeShowMsg'
    }),
    dateReturn (date) {
      console.log(date)
      this.nowDate = date
    },
    onlyDanger () {

    },
    currentChange (pageNum) {

    },
    dangerColor ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && this.pathData.list[rowIndex].label === '潜在异常') {
        return 'color: rgba(244,153,48,1)'
      } else if (columnIndex === 3 && this.pathData.list[rowIndex].label !== '正常') {
        return 'color: rgba(247,77,78,1)'
      }
    },
    init () {
      apiParams.g_id = this.$route.params.personId
      if (window.localStorage.getItem('trailPageFrom') === 'home') {
        apiParams.flag = 'homepage'
        window.localStorage.setItem('trailPageFrom', '')
      } else {
        apiParams.flag = 'personfile'
      }
      apiParams.timestart = this.nowDate[0] === '1919-01-01' ? 'all' : this.nowDate[0]
      apiParams.timeend = this.nowDate[1]
      apiParams.maptype = this.maptype
      apiParams.pagenumber = 1
      apiParams.pagecapacity = 5
      personTrajectory(apiParams).then(res => {
        this.pathData = res.data
      })
    }
  },
  mounted () {
    this.dateDefault = this.$route.params.type === 'err' ? '全部' : '本年'
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/peoplePath.less';
</style>
<style lang="less">
.has-gutter {
  th {
    padding: 0;
    line-height: 42px;
  }
}
</style>
