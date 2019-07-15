<template>
  <div class="peoplePath">
    <!-- 预警提示信息 -->
    <div class="msg" v-if="$route.params.type!=='err' && showMsg && riskNum && riskNum !== '0'">
      <div class="icon"></div>
      <div class="text" >
        {{personName}}共有<span>{{riskNum}}</span>项<span>异常轨迹</span>风险预警
      </div>
      <div class="btn" @click="onlyDanger"><span>点击查看</span></div>
      <div class="del" @click="hideMsg('pathShowMsg')"></div>
    </div>
    <!-- 地图模块 -->
    <div class="mapContainer">
      <div class="title">
        <span class="name">时空轨迹</span>
        <dateCheck @dateReturn="dateReturn" :dateDefault="dateDefault" />
      </div>
      <div class="pathMap">
        <!-- 地图图例 -->
        <div class="legends" v-if="mapType==='marker'">
          <div class="normal"></div>
          <span>正常</span>
          <div class="abnormal"></div>
          <span>潜在异常</span>
          <div class="transboundary"></div>
          <span>矫正越界</span>
        </div>
        <!-- 地图交互控件 -->
        <div class="screeningConditions">
          <div class="abnormalCheckbox">
            <el-checkbox v-model="onlyAbnormal" @change="checkboxChange">只看异常</el-checkbox>
          </div>
          <div class="styleSelect">
            <span>样式:</span>
            <el-select v-model="mapType" placeholder="请选择样式" size="mini">
              <el-option label="热力图" value="heatmap"></el-option>
              <el-option label="点图" value="marker"></el-option>
            </el-select>
          </div>
        </div>
        <!-- 地图组件 -->
        <mapview :map-config="mapConfig" :osm-config="osmConfig"
          :map-types="mapTypes"
          :heatmap="heatmap"
          @pointClick="callback">
          <control :fullscreen="{show: true, position: 'bottom-left'}" :navigation="{showZoom:true, position: 'bottom-right'}"></control>
          <markers :data="markerData" :show-marker="mapType==='marker'" @markerMouseenter="showMarkInfo" @markerMouseleave="hideMarkInfo" @markerClick="setFocusPoint"></markers>
          <popup :showPopup="showPopup" :laglng="laglng" :htmlContent="htmlContent" :closeOnClick="closeOnClick" :closeButton="false"></popup>
        </mapview>
      </div>
    </div>
    <!-- 表格模块 -->
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
import 'mapbox-gl/dist/mapbox-gl.css' // 引入地图组件样式，否则可能导致marker组件失效
import { mapActions } from 'vuex'
import { personTrajectory } from '@/api/api.js'
let apiParams = {}
// 设置marker的样式
const normalMarkerImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAElBMVEUAAAB1vkN1vkN1vkN1vkN1vkNEq6hsAAAABnRSTlMAzL50BW2iYhLOAAAAH0lEQVQI12MAAxYjZQcGZkHBAAYmQUEFMAHmQiRAAAAzEgKlwH02hQAAAABJRU5ErkJggg=='
const abnorMarkerImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX0mTAAAAAHWV8AAAAAAnRSTlPMABHcVXoAAAAPSURBVAjXY/jP0IgE/wMAKDAFBa2/+K0AAAAASUVORK5CYII='
const transMarkerImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEX/Hx8AAAD/Hx//Hx//Hx//Hx//Hx9n2I/lAAAAB3RSTlPMAJczMjEwGAq1CAAAAC1JREFUCNdjUGBgYGJIYGBgYxBiYFBkEGVgCGQQVGASZBB0YAESQopAQthQEAAt/wKHRx622wAAAABJRU5ErkJggg=='
const markerImgMap = {
  '正常': (ele) => { ele.height = 6; ele.width = 6; ele.base64 = normalMarkerImg },
  '潜在异常': (ele) => { ele.height = 6; ele.width = 6; ele.base64 = abnorMarkerImg },
  '矫正越界': (ele) => { ele.height = 8; ele.width = 8; ele.base64 = transMarkerImg }
}
export default {
  name: 'peoplePath',
  props: ['personName', 'riskNum'], // 父组件传值【人名， 风险数】
  data () {
    return {
      closeOnClick: true, // popup组件传参，是否点击空白处取消popup
      focusPoint: false, // 当前获得焦点的marker点
      showPopup: false, // popup组件传值，是否显示popup
      laglng: [121.4198, 31.1043], // popup组件传值，popup弹出的位置
      htmlContent: '<h1>hello</h1>', // popup组件传值，popup弹出的内容
      markerData: [], // marker点数据
      mapType: 'heatmap', // 默认的地图数据展示类型
      dateDefault: '', // dateCheck组件传值，默认日期
      tableData: [], // 表格数据
      nowDate: [], // dateCheck组件返回的开始时间和结束时间
      allTableNum: 0, // 表格数据条数
      currentPage: 1, // 当前页码
      pageSize: 5, // 每一页的条数
      onlyAbnormal: false, // 是否只显示异常
      mapConfig: { // 地图设置
        // <!-- 中心点 -->
        center: [121.4198, 31.1043],
        // <!-- 缩放等级 -->
        zoom: 8.7,
        // <!-- 视角俯视的倾斜角度 -->
        pitch: 0,
        // <!-- 地图的旋转角度 -->
        bearing: 0
      },
      osmConfig: { // 地图瓦片地址及样式
        // <!-- osm地址 -->
        osmUrl: 'http://192.168.22.88:8700',
        // <!-- 地图样式 -->
        backgroundStyle: 'prs-web'
      },
      // <!-- 地图的可视化类型 -->
      mapTypes: ['heatmap'],
      // <!-- 热力图配置项 -->
      heatmap: { // 热力图设置
        radius: 5,
        weight: 1,
        intensity: 1,
        opacity: 0.8,
        color: ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0, 0, 255, 0)', 0.2, 'royalblue', 0.4, 'cyan', 0.6, 'lime', 0.8, 'yellow', 1, 'red'],
        data: []
      },
      firstLoadMap: true
    }
  },
  computed: {
    showMsg () {
      return this.$store.state.people.pathShowMsg
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.params.type === 'err') {
          this.onlyAbnormal = true
          this.dateDefault = '全部'
          this.firstLoadMap = true
        } else {
          this.onlyAbnormal = false
          this.firstLoadMap = true
          this.dateDefault = '本年'
        }
        this.init()
      },
      deep: true
    },
    // select值监控
    mapType (newVal, oldVal) {
      if (newVal === 'marker') {
        this.mapTypes = []
      } else {
        this.mapTypes = []
        this.mapTypes.push('heatmap')
      }
    },
    onlyAbnormal (newVal, oldVal) {
      if (newVal) {
        this.mapConfig.zoom = 7
      } else {
        this.mapConfig.zoom = 8.7
      }
    }
  },
  methods: {
    ...mapActions('people', {
      hideMsg: 'hideMsg'
    }),
    // 只看异常操作
    checkboxChange () {
      if (this.onlyAbnormal) {
        apiParams.flag = '1'
      } else {
        apiParams.flag = '0'
      }
      this.getData()
    },
    // 地图组件callback
    callback (data) {
    },
    // 时间选择器组件返回当前时间
    dateReturn (date) {
      this.nowDate = date
      this.init()
    },
    // 头部消息提示点击查看操作
    onlyDanger () {
      this.hideMsg('pathShowMsg')
      this.onlyAbnormal = true
      apiParams.flag = '1'
      this.dateDefault = '全部'
      // this.getData()
    },
    // 改变当前页码
    currentChange (pageNum) {
      this.currentPage = pageNum
      this.getTableData(this.currentPage)
    },
    // 改变表格中不同风险预警等级文字的颜色
    dangerColor ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && this.tableData[rowIndex].label === '潜在异常') {
        return 'color: rgba(244,153,48,1)'
      } else if (columnIndex === 3 && this.tableData[rowIndex].label !== '正常') {
        return 'color: rgba(247,77,78,1)'
      }
    },
    // 获取表格数据
    getTableData (val) {
      if (this.heatmap.data) {
        let temp = JSON.parse(JSON.stringify(this.heatmap.data))
        this.tableData = temp.splice(this.pageSize * (val - 1), this.pageSize)
      }
    },
    // 获取marker点数据
    getMarkerData (data) {
      if (data) {
        data.forEach(element => {
          markerImgMap[element.label](element)
        })
      }
      this.markerData = data
    },
    // 获取接口数据
    async getData () {
      let res = await personTrajectory(apiParams)
      this.heatmap.data = res.data.data
      this.allTableNum = res.data.resultNum
      this.getMarkerData(res.data.data)
      this.currentPage = 1
      this.getTableData(this.currentPage)
    },
    // 页面初始化
    init () {
      apiParams.g_id = this.$route.params.personId
      apiParams.timestart = this.nowDate[0] === '1919-01-01' ? 'all' : this.nowDate[0]
      apiParams.timeend = this.nowDate[1]
      apiParams.flag = this.$route.params.type === 'err' || this.onlyAbnormal ? '1' : '0'
      this.getData()
    },
    // 刷新地图
    refreshPage () {
      this.mapConfig.center = [121.4198, 31.1043]
    },
    // 添加一键回到中心点（刷新）控件
    addRefreshControl () {
      const MCG = document.getElementsByClassName('mapboxgl-ctrl-bottom-left')[0].getElementsByClassName('mapboxgl-ctrl-group')[0]
      let fullBtn = MCG.firstElementChild
      let fullContainer = document.createElement('div')
      let refreshBtn = document.createElement('div')
      fullContainer.className = 'container fullscreenContainer'
      refreshBtn.className = 'container customRefreshBtn'
      refreshBtn.onclick = this.refreshPage
      MCG.removeChild(fullBtn)
      MCG.appendChild(fullContainer)
      MCG.appendChild(refreshBtn)
      fullContainer.appendChild(fullBtn)
    },
    // 展示marker点的信息（即popup弹出框）
    showMarkInfo (data) {
      this.focusPoint = false
      this.closeOnClick = false
      this.showPopup = true
      this.laglng = [data.lng, data.lat]
      this.htmlContent = `<h1 class="address">${data.address}</h1>
                          <h1 class="risk">${data.label}</h1>
                          <div class="left-top"></div><div class="right-top"></div><div class="left-bottom"></div><div class="right-bottom"></div>`
    },
    // 隐藏Marker点信息
    hideMarkInfo () {
      if (!this.focusPoint) this.showPopup = false
    },
    // 设置焦点marker
    setFocusPoint () {
      this.focusPoint = true
      this.closeOnClick = true
      this.showPopup = false
      setTimeout(() => {
        this.showPopup = true
      }, 10)
    }
  },
  created () {

  },
  mounted () {
    this.onlyAbnormal = this.$route.params.type === 'err'
    this.dateDefault = this.$route.params.type === 'err' ? '全部' : '本年'
    this.$nextTick(() => {
      this.addRefreshControl()
    })
  }
}
</script>

<style lang="less">
@import '~@/assets/css/peoplePath.less';
</style>
