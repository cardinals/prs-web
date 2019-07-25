<template>
  <!-- 外层容器，当子元素中包含 <el-header> 或 <el-footer> 时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
  <div class="container" v-loading="$store.state.app.isShowLoading" :class="{'homePage':$route.fullPath ==='/home'}">
    <!-- 顶栏容器 -->
    <header-com v-if="$route.fullPath!=='/login'&&$route.name!=='错误页'&&$route.fullPath!=='/home'"></header-com>
    <div class="body" :style="{'width':$route.fullPath ==='/home'?'100%':'1200px', 'padding-top': $route.fullPath === '/home'?'0':'94px'}">
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
  created () {}
}
</script>

<style lang="less">
  // 修改elementui默认样式
  @import '~@/assets/css/editElementui.less';
  @import '~@/assets/css/container.less';
</style>
