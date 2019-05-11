/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:05:15
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:51:24
 */

<template>
  <!-- 外层容器，当子元素中包含 <el-header> 或 <el-footer> 时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
  <div class="container" v-loading="$store.state.app.isShowLoading" :style="{'background':$route.fullPath ==='/home'?'white':'#f0f0f0','padding-bottom':$route.fullPath==='/home'?'58px':'154px'}">
    <!-- 顶栏容器 -->
    <header-com v-if="$route.fullPath!=='/login'&&$route.name!=='错误页'"></header-com>
    <div class="body" :style="{'width':$route.fullPath ==='/home'?'100%':'1200px'}">
      <!-- 路由区域 -->
      <router-view class="router"></router-view>
    </div>
    <footer-com  v-if="$route.name!=='错误页'"></footer-com>
    <go-top></go-top>
  </div>
</template>

<script>
export default {
  name: 'container',
  created () {
    // 保存url search 中的token
    const search = window.location.search
    if (search) {
      const token = search.split('?token=')[1]
      if (token) {
        this.$store.dispatch({ type: 'app/setToken', amount: token.split('/')[0] })
      }
    }
  }
}
</script>

<style lang="less">
  // 修改elementui默认样式
  @import '~@/assets/css/editElementui.less';
  html,body{margin:0;padding:0;height:100%;}
  html{
    background: #f0f0f0;
  }
  body{
    overflow-x:auto;
    overflow-y:auto;
  }
  .container{
    position: relative;
    min-height:100%;
    width: 100%;
    padding-bottom: 154px;
    box-sizing: border-box;
    .body{
      width:1200px;
      margin:auto;
    }
  }
  // 遮罩样式
  .el-loading-mask{
    position: fixed!important;
    z-index: 9999!important;//设置层级为最高
  }
</style>
