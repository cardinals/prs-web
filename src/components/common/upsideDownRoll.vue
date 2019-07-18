<template>
  <div class="upsideDown" :style="{height: height + 'px'}">
    <div class="footerContainer" :id="id">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cardFooter',
  props: {
    // 显示窗口的高度
    height: {
      type: Number,
      default: 0
    },
    // 行数
    lineNum: {
      type: Number,
      default: 0
    },
    // 翻转窗口的id
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    // 翻转控制
    rollControl () {
      this.$nextTick(() => {
        let i = 0
        let j = -1
        let footer = document.getElementById(this.id)
        let _this = this
        let roll1 = function () {
          i = i + j
          footer.style.transform = 'translateY(' + i + 'px)'
          if (Math.abs(i % _this.height) === 0) {
            setTimeout(() => {
              requestAnimationFrame(roll1)
            }, 3000)
            if (Math.abs(i / _this.height) === _this.lineNum - 1) {
              j = (-j)
            } else if (i === 0) {
              j = (-j)
            }
          } else {
            requestAnimationFrame(roll1)
          }
        }
        roll1()
      })
    },
    // 开始翻转
    startRoll () {
      if (this.lineNum > 1) {
        this.rollControl()
      }
    }
  },
  mounted () {
    this.startRoll()
  }
}
</script>
<style lang="less">
.upsideDown {
  overflow: hidden;
}
</style>
