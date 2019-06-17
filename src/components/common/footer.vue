<template>
  <div class="footer" :class="{'footer2':$route.fullPath==='/login'||$route.fullPath==='/home'}">
    <div class="line2">© 2019 银江股份有限公司版权所有</div>
  </div>
</template>

<style lang="less">
 @import '~@/assets/css/footer.less';
</style>
