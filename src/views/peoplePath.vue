<template>
  <div class="peoplePath">
    <div class="msg" v-if="$route.params.type!=='err' && showMsg && dynamicNum !== '0'">
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
        <div class="legends" v-if="mapType==='point'">
          <div class="normal"></div>
          <span>正常</span>
          <div class="abnormal"></div>
          <span>潜在异常</span>
          <div class="transboundary"></div>
          <span>矫正越界</span>
        </div>
        <div class="screeningConditions">
          <div class="abnormalCheckbox">
            <el-checkbox v-model="onlyAbnormal" @change="checkboxChange">只看异常</el-checkbox>
          </div>
          <div class="styleSelect">
            <span>样式:</span>
            <el-select v-model="mapType" placeholder="请选择样式" size="mini">
              <el-option label="热力图" value="heatmap"></el-option>
              <el-option label="点图" value="point"></el-option>
            </el-select>
          </div>
        </div>
        <mapview :map-config="mapConfig" :osm-config="osmConfig"
          :map-types="mapTypes"
          :heatmap="heatmap"
          @pointClick="callback">
          <control :fullscreen="{show: true, position: 'bottom-left'}" :navigation="{showZoom:true, position: 'bottom-right'}"></control>
          <markers :data="markerData" :show-marker="mapType==='point'" @markerMouseenter="showMarkInfo" @markerMouseleave="hideMarkInfo" @markerClick="setFocusPoint"></markers>
          <popup :showPopup="showPopup" :laglng="laglng" :htmlContent="htmlContent" :closeOnClick="closeOnClick" :closeButton="false"></popup>
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
import 'mapbox-gl/dist/mapbox-gl.css'
import { mapActions } from 'vuex'
import { personTrajectory } from '@/api/api.js'
let apiParams = {}
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
  data () {
    return {
      closeOnClick: true,
      focusPoint: false,
      showPopup: false,
      laglng: [121.4198, 31.1043],
      htmlContent: '<h1>hello</h1>',
      markerData: [],
      mapType: 'heatmap',
      dateDefault: '',
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
        pitch: 0,
        // <!-- 地图的旋转角度 -->
        bearing: 0
      },
      osmConfig: {
        // <!-- osm地址 -->
        osmUrl: 'http://192.168.22.88:8700',
        // <!-- 地图样式 -->
        backgroundStyle: 'prs-web'
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
      },
      point: {
        color: 'orange',
        textColor: 'red',
        showAnimation: true,
        opacity: 0.8,
        radius: 4,
        textOffset: 1,
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
        if (val.params.type === 'err') {
          this.onlyAbnormal = true
          this.dateDefault = '全部'
        } else {
          this.onlyAbnormal = false
          this.dateDefault = '本年'
        }
        this.init()
      },
      deep: true
    },
    mapType (newVal, oldVal) {
      if (newVal === 'point') {
        this.mapTypes = []
      } else {
        this.mapTypes = []
        this.mapTypes.push('heatmap')
      }
    }
  },
  methods: {
    ...mapActions('path', {
      changeShowMsg: 'changeShowMsg'
    }),
    checkboxChange () {
      if (this.onlyAbnormal) {
        this.mapConfig.zoom = 7
      } else {
        this.mapConfig.zoom = 8.7
      }
      if (this.onlyAbnormal) {
        apiParams.flag = '1'
      } else {
        apiParams.flag = '0'
      }
      this.getData()
    },
    callback (data) {
    },
    dateReturn (date) {
      this.nowDate = date
      console.log(date)
      this.init()
    },
    onlyDanger () {
      this.mapConfig.zoom = 7
      this.changeShowMsg(false)
      this.onlyAbnormal = true
      apiParams.flag = '1'
      this.dateDefault = '全部'
      // this.getData()
    },
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
    getTableData (val) {
      if (this.heatmap.data) {
        let temp = JSON.parse(JSON.stringify(this.heatmap.data))
        this.tableData = temp.splice(this.pageSize * (val - 1), this.pageSize)
      }
    },
    getMarkerData (data) {
      if (data) {
        data.forEach(element => {
          markerImgMap[element.label](element)
        })
      }
      this.markerData = data
    },
    getData () {
      personTrajectory(apiParams).then(res => {
        this.heatmap.data = res.data.data
        this.point.data = res.data.data
        this.allTableNum = res.data.resultNum
        this.getMarkerData(res.data.data)
        this.currentPage = 1
        this.getTableData(this.currentPage)
      })
    },
    init () {
      apiParams.g_id = this.$route.params.personId
      apiParams.timestart = this.nowDate[0] === '1919-01-01' ? 'all' : this.nowDate[0]
      apiParams.timeend = this.nowDate[1]
      apiParams.flag = this.$route.params.type === 'err' || this.onlyAbnormal ? '1' : '0'
      this.getData()
    },
    refreshPage () {
      this.mapConfig.zoom = 8.4
      this.mapConfig.center = [121.4198, 31.1043]
    },
    addRefreshControl () {
      const MCG = document.getElementsByClassName('mapboxgl-ctrl-bottom-left')[0].getElementsByClassName('mapboxgl-ctrl-group')[0]
      let fullBtn = MCG.firstElementChild
      let fullContainer = document.createElement('div')
      let refreshBtn = document.createElement('div')
      refreshBtn.className = 'container fullscreenContainer'
      fullContainer.className = 'container customRefreshBtn'
      fullContainer.onclick = this.refreshPage
      MCG.removeChild(fullBtn)
      MCG.appendChild(refreshBtn)
      refreshBtn.appendChild(fullBtn)
      MCG.appendChild(fullContainer)
    },
    showMarkInfo (data) {
      console.log(data)
      this.focusPoint = false
      this.closeOnClick = false
      this.showPopup = true
      this.laglng = [data.lng, data.lat]
      this.htmlContent = `<h1>地点：${data.address}</h1>
                          <h1>风险预警：${data.label}</h1>`
    },
    hideMarkInfo () {
      if (!this.focusPoint) this.showPopup = false
    },
    setFocusPoint () {
      this.focusPoint = true
      this.closeOnClick = true
      console.log(this.closeOnClick)
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
.abnormalCheckbox {
  .el-checkbox{
    color: #333333;
    .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #333333;
  }
  }
}
.el-select-dropdown {
  border: none;
  .el-scrollbar {
    .el-select-dropdown__list {
      padding: 5px 0;
      .el-select-dropdown__item {
        color: rgba(172,172,172,1);
        padding-left: 15px;
        &.hover {
          background: rgba(39,112,238,1) !important;
        }
      }
    }
  }
}
.mapboxgl-ctrl-top-left {
  bottom: 10px;
  top: auto;
  button {
    width: 20px;
    height: 20px;
    .mapboxgl-ctrl-compass-arrow {
      width: 10px !important;
      height: 10px !important;
    }
  }
}
.mapboxgl-marker-anchor-center {
  cursor: pointer;
}
.mapboxgl-ctrl-bottom-left {
  display: flex;
  flex-direction: column;
  .mapboxgl-ctrl-group {
    background: transparent;
    box-shadow: none;
    padding: 2px;
    .container {
      background: #fff;
      box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.11);
      height: 30px;
      width: 30px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: rgb(241, 241, 241)
      }
      &.customRefreshBtn {
        margin-top: 10px;
        background-image: url('../assets/images/refresh.png');
        background-position: center;
        background-repeat: no-repeat;
      }
      &.fullscreenContainer {
        .mapboxgl-ctrl-icon {
          margin: 0;
          border: 0;
          outline: 0;
          padding: 0;
          width: 30px;
          height: 30px;
          background-color: transparent;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background-color: rgb(241, 241, 241);
          }
        }
      }
    }
  }

}
</style>
