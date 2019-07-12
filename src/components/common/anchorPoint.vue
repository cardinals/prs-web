<template>
  <div class="anchor_c">
    <div class="list-ul">
      <div v-for="(item, index) in catalog" :key="index" @click="goAnchor(item)" class="list-li" :class="{'active':item === showWhich}">
        <i class="circle"></i>
        <span>{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['catalog', 'defaultSelect'],
  data () {
    return {
      showWhich: ''
    }
  },
  methods: {
    // 锚点跳转
    goAnchor (selector) {
      // 查询id 去掉空格
      let anchor = document.querySelector('#' + selector.replace(/\s/g, ''))
      // 交互
      this.showWhich = selector
      let index = 1
      // 计算当前滚动条和元素之差
      let delt = anchor.offsetTop - document.querySelector('html').scrollTop
      // 写个定时器实现过渡效果
      let timer = setInterval(() => {
        document.querySelector('html').scrollTop += delt / 20
        index++
        if (index === 21) { clearInterval(timer) }
      }, 10)
    },
    test () {
      let scrollTopArr = []
      for (let i = 0; i < this.catalog.length; i++) {
        let element = document.getElementById(this.catalog[i])
        let height = document.documentElement.scrollTop - element.offsetTop - element.parentElement.offsetTop
        if (height > 80) {
          scrollTopArr.push({ index: i, value: height })
        }
      }
      if (scrollTopArr.length > 0) {
        let res = scrollTopArr.reduce((x, y) => {
          if (x.value <= y.value) {
            return x
          } else {
            return y
          }
        })
        this.showWhich = this.catalog[res.index + 1 > this.catalog.length ? this.catalog.length : res.index + 1]
      } else {
        this.showWhich = this.catalog[0]
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.test)
    this.showWhich = this.defaultSelect ? this.defaultSelect : ''
  }
}
</script>

<style lang="less">
  @import '~@/assets/css/anchorPoint.less';
</style>
