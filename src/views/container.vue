<template>
  <!-- 外层容器，当子元素中包含 <el-header> 或 <el-footer> 时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
  <div class="container" v-loading="$store.state.app.isShowLoading" :class="{'homePage':$route.fullPath ==='/home'}">
    <!-- 顶栏容器 -->
    <header-com v-if="$route.fullPath!=='/login'&&$route.name!=='错误页'&&$route.fullPath!=='/home'"></header-com>
    <div class="body" :style="{'width':$route.fullPath ==='/home'?'100%':'1200px'}">
      <!-- 路由区域 -->
      <router-view class="router"></router-view>
    </div>
    <footer-com  v-if="$route.name!=='错误页'&&$route.fullPath!=='/home'"></footer-com>
    <go-top></go-top>
  </div>
</template>

<script>
export default {
  name: 'container',
  created () {
    // 保存url search 中的token
    console.log(this.$store.state.app.isShowLoading)
    const search = window.location.search
    if (search) {
      const token = search.split('?token=')[1]
      if (token) {
        this.$store.dispatch({ type: 'app/setToken', amount: token.split('/')[0] })
      }
    }
    console.log(this.$store.state.app.isShowLoading)
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
    // padding-bottom: 154px;
    box-sizing: border-box;
    &.homePage {
      background: url('../assets/images/home/pic_bg.png');
    }
    .body{
      width:1200px;
      height: 100%;
      margin:auto;
    }
  }
  // 遮罩样式
  .el-loading-mask{
    position: fixed!important;
    z-index: 9999!important;//设置层级为最高
  }
</style>
