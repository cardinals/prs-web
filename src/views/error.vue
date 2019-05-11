/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:51:29
 * @Last Modified by:   wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-09-18 10:51:29
 */

<template>
  <div class="error">
    <div class="left">
      <div class="img" :class="{error403: imgClass==='error403',error404: imgClass==='error404',error500: imgClass==='error500'}"></div>
    </div>
    <div class="right">
      <h1>{{errorCode}}</h1>
      <div class="desc">{{des}}</div>
      <el-button @click="handleButtonClick()">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  data () {
    return {
      errorCode: 500,
      list: {
        500: {des: '抱歉，服务器出错了', img: 'error500'},
        404: {des: '抱歉，你访问的页面不存在', img: 'error404'},
        403: {des: '抱歉，你无权访问该页面', img: 'error403'}
      }
    }
  },
  watch: {
    '$route': function (v1, v2) {
      if (this.$route.params.code) {
        this.errorCode = this.$route.params.code
      }
    }
  },
  computed: {
    des: function () {
      return this.list[this.errorCode] ? this.list[this.errorCode]['des'] : '未知错误'
    },
    imgClass: function () {
      return this.list[this.errorCode] ? this.list[this.errorCode]['img'] : 'error404'
    }
  },
  methods: {
    handleButtonClick () {
      this.$router.push({path: '/'})
    }
  },
  created () {
    if (this.$route.params.code) {
      this.errorCode = this.$route.params.code
    }
  }
}
</script>

<style lang="less" scoped>
  .error {
    display: flex;
    min-height: 500px;
    height: 100%;
    background: #f0f0f0;
    padding-top: 20% !important;
    .left {
      flex: 0 0 50%;
      width: 50%;
      padding-right: 152px;
      zoom: 1;
      .img {
        height: 360px;
        width: 100%;
        max-width: 430px;
        float: right;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: contain;
      }
      .error403 {
       background-image:url(~@/assets/images/error/403.png);
      }
      .error404 {
       background-image:url(~@/assets/images/error/404.png);
      }
      .error500 {
       background-image:url(~@/assets/images/error/500.png);
      }
    }
    .right {
      flex: auto;
      margin-top: 55px;
      h1 {
        display: block;
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
      }
      .desc {
        color: rgba(0, 0, 0, .45);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
  }
</style>
