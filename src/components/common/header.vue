<template>
  <div class="header" :style="{'margin-bottom':$route.fullPath ==='/home'?'0':'23px'}">
    <div class="main" >
      <div @click="$router.push('/home')" v-if="$route.fullPath!=='/home'" class="logo_c clearfix">
        <div class="logo"></div>
        <span class="title">全景搜索</span>
      </div>
      <div  v-if="$route.fullPath!=='/home'" class="search_c">
        <div class="select_c">
           <el-select v-model="searchType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </div>
        <div class="border"></div>
        <div class="search">
          <el-autocomplete
            class="inline-input"
            v-model="searchVal"
            :fetch-suggestions="querySearch"
            :placeholder="placeholder"
            @select="handleSelect"
            @keydown.enter.native = "goSearch"
            :trigger-on-focus="false"
            max=20
          >
          <template slot-scope="props">
            <div class="name">{{ props.item.text }}</div>
          </template>
          </el-autocomplete>
        </div>
        <div @click="goSearch" class="search_btn">
          <i class="el-icon-search"></i>
        </div>
      </div>
      <div class="menu_c">
        <div class="icon"></div>
        <div class="menu clearfix">
          <el-dropdown @command="dropdownClick" trigger="click">
            <span class="el-dropdown-link">
              <el-tooltip effect="light" placement="bottom-end">
              <div slot="content">{{userName}}</div>
              <span>已登录</span>
              </el-tooltip>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='logout'>{{'登出'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { tipsCN, tipsEN, logout } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      options: [{
        value: 'people',
        label: '搜人员',
        disabled: false
      }, {
        value: 'case',
        label: '搜案例',
        disabled: true
      }, {
        value: 'org',
        label: '搜机构',
        disabled: true
      }],
      placeholder: '请输入人名、身份证号(最少2位)、电话号码(最少3位)',
      // 登录用户名
      userName: localStorage.getItem('prs_web_username')
    }
  },
  computed: {
    searchType: {
      get: function () {
        return this.$store.state.header.searchType
      },
      set: function (newVal) {
        this.changeSearchType(newVal)
      }
    },
    searchVal: {
      get: function () {
        return this.$store.state.header.searchVal
      },
      set: function (newVal) {
        this.changeSearchVal(newVal)
      }
    }
  },
  methods: {
    ...mapMutations({
      changeSearchVal: 'header/changeSearchVal',
      changeSearchType: 'header/changeSearchType'
    }),
    // 获取汉字
    ifCN (v) {
      if (v === '' || (/^\s*$/gi).test(v)) return ''
      let res = v.match(/[\u4e00-\u9fa5]*/g)
      if (res) {
        return res.join('')
      } else return false
    },
    // 选择下拉列表搜索条件
    handleSelect (select) {
      this.changeSearchVal(select.text)
      this.$router.replace('/searchList/' + this.searchType + '/' + select.text)
    },
    // 搜索提示
    async querySearch (queryString, callback) {
      let CN = this.ifCN(queryString)
      if (CN === '') {
        let noQuery = []
        callback(noQuery)
      }
      if (CN) {
        let res = await tipsCN({ 'query': CN })
        callback(res.data)
      } else {
        let res = await tipsEN({ 'prefix': queryString })
        callback(res.data)
      }
    },
    // 去搜索结果页
    goSearch () {
      if (this.searchVal === '') {
        Message({
          message: '请输入搜索信息',
          type: 'warning'
        })
      } else if (/^[0-9]+$/.test(this.searchVal) && this.searchVal.length < 2) {
        Message({
          message: '数字查询时，请最少输入两位及以上的数字',
          type: 'warning'
        })
      } else {
        this.$router.replace('/searchList/' + this.searchType + '/' + this.searchVal)
      }
    },
    // 用户登出
    async logout () {
      // 登录类型 normal、sso
      const loginType = process.env.VUE_APP_loginType
      let res = await logout()
      if (res.code === 1) {
        Message({ message: res.message, type: 'info', duration: 1500 })
        if (loginType === 'sso') {
          // 如果登陆类型为sso, 跳转响应中的登出页面地址
          setTimeout(() => {
            location.href = res.data
          }, 2000)
        } else {
          // 如果登陆类型为normal, 跳转系统登录模块
          setTimeout(() => {
            location.href = `${location.origin}/#/login`
          }, 2000)
        }
      } else {
        Message({ message: res.message, type: 'error' })
      }
    },
    // 下拉点击
    dropdownClick (command) {
      if (command === 'logout') {
        this.logout()
      }
    }
  },
  mounted () {}
}
</script>
<style>
.header .el-autocomplete .el-input__inner{
  color: #474747!important;
}
</style>

<style lang="less">
  @import '~@/assets/css/header.less';
</style>
