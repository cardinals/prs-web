<template>
  <div class="peopleInfoPage">
    <!-- 左边栏 -->
    <div class="sidebarLeft">
      <!-- 基本信息 -->
      <div class="basicInfo">
        <div class="noData" v-if="peopleBasicInfo === {}">
          <h2>There is no data</h2>
        </div>
        <!-- <img :src="portrait" v-if="portrait !==''"> -->
        <div class="photoContainer" v-if="true">
          <div class="photo" :class="genderClass()" @click="goInfo"></div>
        </div>
        <div class="info">
          <span class="name" :class="genderClass()"  @click="goInfo" :title="peopleBasicInfo.basicInfo.name">{{peopleBasicInfo.basicInfo.name|nameFilter}}</span>
          <br>
          <span class="idNumber" :style="peopleBasicInfo.basicInfo.idNumber === '' ? 'color:#989A9F' : ''">{{peopleBasicInfo.basicInfo.idNumber|idFormat}}</span>
          <div class="tagsContainer">
            <div> {{peopleBasicInfo.basicInfo.type}} </div>
          </div>
        </div>
      </div>
      <!-- 风险预警 -->
      <div class="title">风险预警（全部）</div>
      <div class="riskWarning">
        <div class="abnormal abnormalDynamic">
          <span @click="goAbnormal('abnormalDynamic')"> 异常动态: </span>
          <span> {{peopleBasicInfo.riskWarn.abnormalDynamic}}项 </span>
        </div>
         <div class="abnormal abnormalTrail">
          <span @click="goAbnormal('abnormalTrail')"> 异常轨迹: </span>
          <span> {{peopleBasicInfo.riskWarn.abnormalTrail}}项 </span>
        </div>
         <div class="abnormal abnormalRelation" >
          <span @click="goAbnormal('abnormalRelation')"> 异常关系: </span>
          <span> {{peopleBasicInfo.riskWarn.abnormalRelation}}项 </span>
        </div>
      </div>
      <!-- 特征标签 -->
      <div class="title">特征标签</div>
      <div class="tags">
        <el-tag v-for="(value, index) in peopleBasicInfo.selftags" :key="index" :type="tagType[value.value - 1]" :title="value.name">
          {{value.name | tagFilter}}
        </el-tag>
      </div>
    </div>
    <!-- 右边栏 -->
    <div class="sidebarRight">
      <!-- 头部导航标签 -->
      <div class="hearderMenu">
        <span :class="{'checked': menuChoice === 'info'}" @click="menuClick('info')">人物信息</span>
        <span :class="{'checked': menuChoice === 'dynamic'}" @click="menuClick('dynamic')">人物动态</span>
        <span :class="{'checked': menuChoice === 'peoplePath'}" @click="menuClick('peoplePath')">时空轨迹</span>
        <span :class="{'checked': menuChoice === 'relationship'}" @click="menuClick('relationship')">人物关系</span>
      </div>
      <!-- 子路由 -->
      <router-view
        :risk-num="riskNum"
        :person-name="personName"
        :wristband="peopleBasicInfo.wristband"
      ></router-view>
    </div>
  </div>
</template>
<script>
import { getbasicInfo } from '@/api/api.js'
import { mapActions } from 'vuex'
// 异常名称映射
let abnormalMap = {
  abnormalDynamic: '异常动态',
  abnormalTrail: '异常轨迹',
  abnormalRelation: '异常关系'
}
export default {
  name: 'peopleInfoPage',
  data () {
    return {
      riskNum: 0,
      personName: '',
      peopleBasicInfo: { // 人员基本信息
        basicInfo: {},
        riskWarn: {},
        selftags: [],
        wristband: 0
      },
      tagType: ['', 'success', 'warning', 'danger'], // 标签级别
      menuChoice: 'info', // 默认导航路由
      menuMap: { // 导航类型映射表
        dynamic: 'abnormalDynamic',
        peoplePath: 'abnormalTrail',
        relationship: 'abnormalRelation'
      }
    }
  },
  methods: {
    ...mapActions({ showAllMsg: 'people/showAllMsg' }),
    // 获取基本信息数据
    async getbasicInfo () {
      let res = await getbasicInfo({ g_id: this.$route.params.personId })
      this.peopleBasicInfo = res.data
      this.personName = this.peopleBasicInfo.basicInfo.name
      this.riskNum = this.peopleBasicInfo.riskWarn[this.menuMap[this.menuChoice]]
    },
    // 性别class控制
    genderClass () {
      if (this.peopleBasicInfo.basicInfo.gender === '男性') return 'man'
      if (this.peopleBasicInfo.basicInfo.gender === '女性') return 'women'
      return 'unknow'
    },
    // 导航点击跳转
    menuClick (msg) {
      this.menuChoice = msg
      if (msg !== 'info') {
        this.$router.replace('/detail/' + this.$route.params.personId + '/' + msg + '/all')
      } else {
        this.$router.replace('/detail/' + this.$route.params.personId + '/' + msg)
      }
    },
    // 风险预警点击跳转
    goAbnormal (val) {
      let id = this.$route.params.personId
      if (val === 'abnormalRelation') {
        this.$router.replace('/detail/' + id + '/relationship/err')
        this.menuChoice = 'relationship'
      }
      if (val === 'abnormalDynamic') {
        this.$router.replace('/detail/' + id + '/dynamic/err')
        this.menuChoice = 'dynamic'
      }
      if (val === 'abnormalTrail') {
        this.$router.replace('/detail/' + id + '/peoplePath/err')
        this.menuChoice = 'peoplePath'
      }
    },
    // 人物头像及名称点击跳转
    goInfo () {
      this.$router.replace('/detail/' + this.$route.params.personId + '/info')
      this.menuChoice = 'info'
    }
  },
  watch: {
    menuChoice: {
      handler: function (newVal, oldVal) {
        if (newVal !== 'info') this.riskNum = this.peopleBasicInfo.riskWarn[this.menuMap[newVal]]
      }
    }
  },
  filters: {
    idFormat (val) {
      if (typeof val === 'undefined' || val.length === 0) return '暂无'
      return val.substring(0, 4) + '************' + val.substring(val.length - 2, val.length)
    },
    keyFormat (val) {
      return abnormalMap[val]
    },
    tagFilter (val) {
      if (!val) return val
      return val.length > 9 ? val.substring(0, 9) + '...' : val
    },
    nameFilter (val) {
      if (!val) return val
      if (val.length >= 5) {
        return val.substring(0, 4) + '...'
      }
      return val
    }
  },
  mounted () {
    this.getbasicInfo()
    this.showAllMsg()
    this.menuChoice = this.$route.path.split('/')[this.$route.path.split('/').length - 1]
    this.menuChoice = this.$route.name
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/peopleDetailContainer.less';
</style>
