<template>
<div class="rollWindow">
<div class="rollContainer" ref="rollContainer">
<div class="content" v-for="(item,index) in contentData" :key="index">
<h1>{{item}}</h1>
</div>
</div>
<el-button type="primary" @click="move">move</el-button>
</div>
</template>
<script>
let i = 0
export default {
  data () {
    return {
      contentData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
    }
  },
  methods: {
    move () {
      i = i + 2
      let _this = this
      this.$refs.rollContainer.style.transform = 'translateX(-' + i + 'px)'
      if (i % 130 !== 0) {
        requestAnimationFrame(this.move)
      } else if (i !== (40 * 100 + 39 * 30)) {
        setTimeout(() => {
          _this.move()
        }, 2000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rollWindow {
  background: skyblue;
  width: 620px;
  .rollContainer {
    display: flex;
    .content {
      width: 100px;
      height: 200px;
      background: gray;
      text-align: center;
      margin-left: 30px;
      flex: 0 0 auto;
      &:first-child{
        margin-left: 0;
      }
    }
  }
}
</style>
