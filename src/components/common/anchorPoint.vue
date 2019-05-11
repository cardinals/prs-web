<template>
  <div class="anchor_c">
    <div class="nav">
      <div class="box1" @click.stop="showList = !showList">
        <i class="icon"></i>
        <span class="span">目录</span>
      </div>
      <div @click="collectionfn" class="box2" :class="{'active':flag!==0}">
        <i class="icon"></i>
        <span class="span" v-text="flag!==0?'已收藏':'收藏'"></span>
      </div>
    </div>
    <div class="list-ul" v-show="showList">
      <div v-for="item in catalog" :key = item.id @click="goAnchor(item)" class="list-li" :class="{'active':item === showWhich}">
        <i class="circle"></i>
        <span>{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { collection } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  props: ['catalog', 'ids', 'subtype', 'title', 'detailType', 'collectFlag'],
  data () {
    return {
      showList: false,
      showWhich: '',
      flag: 0
    }
  },
  watch: {
    collectFlag: function (to, from) {
      this.flag = to
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
    // 收藏
    collectionfn () {
      let _this = this
      collection({
        'id': _this.ids,
        'subtype': _this.subtype,
        'title': _this.title,
        'detailType': _this.detailType
      }).then((res) => {
        if (res.code === 1) {
          _this.flag = 1
          Message({
            message: res.message,
            type: 'success'
          })
        } else if (res.code === 6) {
          _this.flag = 0
          Message({
            message: res.message,
            type: 'success'
          })
        } else {
          Message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
  },
  mounted () {
    let _this = this
    // 监听滚轮 这个效果暂时不要了，鼠标滚动到底部的时候无法判定最后几个节点
    // window.addEventListener('scroll', function () {
    //   let min = 999
    //   let which = 0
    //   _this.arr.forEach((item, index) => {
    //     let anchor = document.querySelector(item.id)
    //     let delt = anchor.offsetTop - document.querySelector('html').scrollTop
    //     which = Math.abs(delt) < min ? index : which
    //     min = Math.abs(delt) < min ? Math.abs(delt) : min
    //   })
    //   _this.showWhich = _this.arr[which].id
    // })
    // body监听一下点击事件
    window.addEventListener('click', function () {
      _this.showList = false
    })
  }
}
</script>

<style lang="less">
  @import '~@/assets/css/anchorPoint.less';
</style>
