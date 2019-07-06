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
      <div class="pathMap">
        <mapview :map-config="mapConfig" :osm-config="osmConfig"
          :map-types="mapTypes"
          :heatmap="heatmap"
          @pointClick="callback">
        </mapview>
      </div>
    </div>
    <div class="tableContainer">
      <div class="title">
        <span class="name">轨迹清单</span>
      </div>
      <div class="pathTable">
        <el-table :data="tableData" :cell-style="dangerColor">
          <el-table-column prop="time" label="时间" />
          <el-table-column prop="address" label="地点" width="300"/>
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="label" label="风险预警"  />
        </el-table>
        <div class="page" v-if="allTableNum > 5">
          <el-pagination
            small
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="allTableNum"
            :current-page="currentPage"
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
      tableData: [],
      nowDate: [],
      allTableNum: 0,
      currentPage: 1,
      pageSize: 5,
      maptype: 'points',
      onlyAbnormal: false,
      mapConfig: {
        // <!-- 中心点 -->
        center: [121.4198, 31.1043],
        // <!-- 缩放等级 -->
        zoom: 8.7,
        // <!-- 视角俯视的倾斜角度 -->
        pitch: 43,
        // <!-- 地图的旋转角度 -->
        bearing: 0
      },
      osmConfig: {
        // <!-- osm地址 -->
        osmUrl: 'http://192.168.22.88:8700',
        // <!-- 地图样式 -->
        backgroundStyle: 'Positron'
      },
      // <!-- 地图的可视化类型 -->
      mapTypes: ['heatmap'],
      // <!-- 热力图配置项 -->
      heatmap: {
        radius: 5,
        weight: 1,
        intensity: 1,
        opacity: 0.8,
        color: ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0, 0, 255, 0)', 0.2, 'royalblue', 0.4, 'cyan', 0.6, 'lime', 0.8, 'yellow', 1, 'red'],
        data: []
      }
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
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.init()
      },
      deep: true
    },
    onlyAbnormal (newVal, oldVal) {
      if (newVal) {
        apiParams.flag = '1'
      } else {
        apiParams.flag = '0'
      }
      this.getData()
    }
  },
  methods: {
    ...mapActions('path', {
      changeShowMsg: 'changeShowMsg'
    }),
    callback (data) {
      console.log(data)
    },
    dateReturn (date) {
      this.nowDate = date
    },
    onlyDanger () {
      this.changeShowMsg(false)
      this.onlyAbnormal = true
    },
    currentChange (pageNum) {
      this.currentPage = pageNum
      this.getTableData(this.currentPage)
      console.log(this.heatmap.data.length)
    },
    // 改变表格中不同风险预警等级文字的颜色
    dangerColor ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && this.tableData[rowIndex].label === '潜在异常') {
        return 'color: rgba(244,153,48,1)'
      } else if (columnIndex === 3 && this.tableData[rowIndex].label !== '正常') {
        return 'color: rgba(247,77,78,1)'
      }
    },
    getTableData (val) {
      let temp = JSON.parse(JSON.stringify(this.heatmap.data))
      this.tableData = temp.splice(this.pageSize * (val - 1), this.pageSize)
    },
    getData () {
      personTrajectory(apiParams).then(res => {
        this.heatmap.data = res.data.data
        this.allTableNum = res.data.resultNum
        this.currentPage = 1
        this.getTableData(this.currentPage)
      })
    },
    init () {
      apiParams.g_id = this.$route.params.personId
      apiParams.timestart = this.nowDate[0] === '1919-01-01' ? 'all' : this.nowDate[0]
      apiParams.timeend = this.nowDate[1]
      apiParams.flag = this.$route.params.type === 'err' ? '1' : '0'
      this.getData()
    }
  },
  created () {

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
.pathTable {
  .page {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
