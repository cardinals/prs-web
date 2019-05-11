/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:01:39
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 11:00:18
 */

<template>
  <div class="footer" :class="{'footer2':$route.fullPath==='/login'||$route.fullPath==='/home'}">
    <!-- <div v-if="$route.fullPath!=='/login'&&$route.fullPath!=='/home'" class="line1">
      <span class="span">帮助</span>
      <span class="span">隐私</span>
      <span class="span">条款</span>
    </div> -->
    <div class="line2">copyright @上海市司法局大数据实验室 | 银江股份有限公司</div>
  </div>
</template>

<style lang="less">
 @import '~@/assets/css/footer.less';
</style>
