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
  computed: {
    // 生成锚点数据 id(锚点名称) min(DOM顶部距离页面顶部的高度) max(DOM底部距离页面顶部的高度)
    anchorPointArray: function () {
      let list = []
      for (let i = 0; i < this.catalog.length; i++) {
        let element = document.getElementById(this.catalog[i])
        list.push({ id: this.catalog[i], min: element.offsetTop, max: element.offsetTop + element.offsetHeight })
      }
      return list
    }
  },
  methods: {
    // 锚点跳转
    goAnchor (selector) {
      window.removeEventListener('scroll', this.scroll)
      // 选中锚点
      this.showWhich = selector
      // 获取DOM节点
      let anchor = document.querySelector('#' + selector.replace(/\s/g, ''))
      // 重新设置滚动高度
      document.documentElement.scrollTop = anchor.offsetTop
      let time = setTimeout(() => {
        window.addEventListener('scroll', this.scroll)
        clearTimeout(time)
      }, 50)
    },
    // 查找锚点
    findAnchor () {
      // 获取当前高度
      const scrollTop = document.documentElement.scrollTop
      // 遍历锚点列表
      this.anchorPointArray.map((item) => {
        if ((item.min <= scrollTop) && (scrollTop <= item.max)) {
          // 选中锚点
          this.showWhich = item.id
        }
      })
    },
    // 滚动事件
    scroll () {
      this.findAnchor()
    }
  },
  mounted () {
    // 设置初始锚点
    this.showWhich = this.defaultSelect ? this.defaultSelect : ''
    // 添加滚动事件监听
    window.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.scroll)
  }
}
</script>

<style lang="less">
  @import '~@/assets/css/anchorPoint.less';
</style>
