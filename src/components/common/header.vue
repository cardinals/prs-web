/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:01:31
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-11-05 18:19:37
 */

<template>
  <div class="header" :style="{'margin-bottom':$route.fullPath ==='/home'?'0':'23px'}">
    <div class="main" >
      <div @click="$router.push('/home')" v-if="$route.fullPath!=='/home'" class="logo_c clearfix">
        <i class="logo"></i>
        <span class="title">法案智搜</span>
      </div>
      <div  v-if="$route.fullPath!=='/home'" class="search_c">
        <div class="select_c">
           <el-select v-model="searchType" placeholder="请选择" @change="selectType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
            placeholder="请输入关键词"
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
        <div class="menu clearfix" v-if="ifLogin">
          <el-dropdown @command="goLogin" trigger="click">
            <span class="el-dropdown-link">
              <el-tooltip effect="light" placement="bottom-end">
              <div slot="content">{{userName}}</div>
              <span>已登录</span>
              </el-tooltip>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command='ifLogin'>{{'注销'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="!ifLogin" class="menu2" @click="goLogin(false)">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { tipsCN, tipsEN } from '@/api/api.js'
import {Message} from 'element-ui'
export default {
  data () {
    return {
      options: [{
        value: 'mediateCase',
        label: '调解案例'
      }, {
        value: 'protocol',
        label: '调解协议'
      }, {
        value: 'judgement',
        label: '裁判文书'
      }, {
        value: 'law',
        label: '法律法规'
      }],
      // 登录用户名
      userName: localStorage.getItem('tattusername')
    }
  },
  computed: {
    ...mapState('header', {
      ifLogin: state => state.ifLogin
    }),
    // vue最近更新了版本，要求必须在计算属性里加上setter，否则报错。
    searchType: {
      get: function () {
        return this.$store.state.header.searchType
      },
      set: function (newVal) {
      }
    },
    // 重写set方法
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
    ...mapActions({
      changeLoginAsync: 'header/changeLoginAsync',
      logoutAsync: 'header/logoutAsync'
    }),
    // 注销或登录按钮
    goLogin (command) {
      let _this = this
      if (command) {
        _this.logoutAsync().then((res) => {
          if (res.code === 1) {
            Message({
              message: res.message,
              type: 'success'
            })
            _this.$router.push('/login')
          } else {
            Message({
              message: res.message,
              type: 'warning'
            })
          }
        })
      } else {
        _this.$router.push('/login')
      }
    },
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
    },
    // 搜索提示
    querySearch (queryString, callback) {
      let CN = this.ifCN(queryString)
      if (CN) {
        tipsCN({'prefix': CN}).then((res) => {
          callback(res.data)
        })
      } else {
        tipsEN({'prefix': queryString}).then((res) => {
          callback(res.data)
        })
      }
    },
    // 选择类型
    selectType (val) {
      this.changeSearchType(val)
    },
    goSearch () {
      let _this = this
      this.changeSearchVal(_this.searchVal)
      this.changeSearchType(_this.searchType)
      if (this.searchVal !== '') {
        this.$router.push('/searchList/' + _this.searchType + '/' + _this.searchVal)
      } else {
        Message({
          message: '请输入搜索信息',
          type: 'warning'
        })
      }
    }
  },
  mounted () {
    this.changeLoginAsync()
  }
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
