<template>
  <div class="goTop" :class="{'show':show}" @click="goTop">
    <i class="el-icon-upload2"></i>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      show: false
    }
  },
  methods: {
    goTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let index = 1
      let timer = setInterval(() => {
        document.querySelector('html').scrollTop -= scrollTop / 20
        index++
        if (index === 21) { clearInterval(timer) }
      }, 10)
    }
  },
  mounted () {
    let _this = this
    window.addEventListener('scroll', function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 200) {
        _this.show = true
      } else {
        _this.show = false
      }
    })
  }
}
</script>

<style lang="less">
.show{
  bottom: 132px!important;
  opacity: 1!important;
}
.goTop{
  width: 34px;
  height: 34px;
  background: rgba(0,0,0,0.4);
  position: fixed;
  right: 68px;
  bottom: 90px;
  border-radius: 4px;
  text-align: center;
  opacity: 0;
  transition: 0.15s linear;
  border-radius: 50%;
  cursor: pointer;
  &:hover{
    background:#30333C;
  }
  .el-icon-upload2{
    font-size: 18px;
    line-height: 34px;
    color: #ffffff;
  }
}

</style>
