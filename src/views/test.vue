<template>
  <div class="test">
    <div v-for="(item, index) in items1" :key="index"> {{item}} </div>
    <el-button type="primary" @click="refresh">刷新</el-button>
    <div class="shadow" ref="shadow">
      <div class="items" ref='items'>
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
      </div>
      <div class="btn" @click="zhankai" v-if="!up">
        展开
      </div>
      <div class="btn" @click="shouqi" v-if="up">
        收起
      </div>
    </div>
    <div class="type">
      <div class="activeType" ref="activeType">
        <div class="name">
          活动类型:
        </div>
        <div class="items" ref="items1">
          <span v-for="(item, index) in activeType" :key="index" :class="{'checked':index === activeChecked}" @click="activeChecked = index">
            {{item.name}}({{item.value}})
          </span>
        </div>
        <div class="openRetract" @click="openActiveType">
          <span v-if="!isOpen_active">展开</span>
          <span v-if="isOpen_active">收起</span>
          <i class="el-icon-arrow-down" :class="{'rotate': isOpen_active}"></i>
        </div>
      </div>
      <div class="dangerType" >
        <div class="name">
          风险类型:
        </div>
        <div class="items" ref="items" style="background: skyBlue">
          <div class="container" ref="dangerType" style="background: gray;">
            <span class="filter" v-if="dangerChecked >= 0" @click="filterControl(-1)">取消过滤</span>
            <span v-for="(item, index) in dangerType" :key="index" :class="{'checked':index === dangerChecked}" @click="filterControl(index)">
              {{item.name}}({{item.value}})
            </span>
          </div>
        </div>
        <div class="openRetract" @click="openDangerType">
          <span v-if="!isOpen_danger">展开</span>
          <span v-if="isOpen_danger">收起</span>
          <i class="el-icon-arrow-down" :class="{'rotate': isOpen_danger}"></i>
        </div>
      </div>
    </div>
    <div class="heightTest" ref="htest">
      <el-button type="primary" @click="htest">+</el-button>
      <div>{{ height }} </div>
    </div>

  </div>
</template>
<script>
import { getTest } from '@/api/api.js'
export default {

  name: 'test',
  data () {
    return {
      isOpen_active: false,
      isOpen_danger: false,
      dangerChecked: -1,
      activeChecked: 0,
      items1: [],
      allData: [],
      index: 0,
      shadowheight: 35,
      up: false,
      activeType: [
        {
          'name': '全部',
          'value': 356
        },
        {
          'name': '执行矫正',
          'value': 112
        },
        {
          'name': '人民调解',
          'value': 92
        },
        {
          'name': '法律援助',
          'value': 23
        },
        {
          'name': '某某类型',
          'value': 25
        },
        {
          'name': '某某类型',
          'value': 24
        },
        {
          'name': '某某类型',
          'value': 22
        },
        {
          'name': '某某类型',
          'value': 21
        },
        {
          'name': '某某类型',
          'value': 37
        }
      ],
      dangerType: [
        {
          'name': '全部',
          'value': 356
        },
        {
          'name': '群体性事件',
          'value': 112
        },
        {
          'name': 'A类案件',
          'value': 92
        },
        {
          'name': '矫正越界',
          'value': 23
        },
        {
          'name': '某某类型',
          'value': 25
        },
        {
          'name': '某某类型',
          'value': 24
        },
        {
          'name': '某某类型',
          'value': 22
        },
        {
          'name': '某某类型',
          'value': 21
        },
        {
          'name': '某某类型',
          'value': 37
        },
        {
          'name': '某某类型',
          'value': 37
        }
      ]
    }
  },
  methods: {
    gaodu () {
      if (this.msg !== '') {
        this.msg = ''
      } else {
        this.msg = '这是一个名称'
      }
      this.$nextTick(() => {
        // console.log()
        if (!this.status) {
          this.$refs.chuangkou.style.height = this.$refs.rongqi.clientHeight + 'px'
        }
      })
    },
    open () {
      this.$refs.chuangkou.style.height = this.$refs.rongqi.clientHeight + 'px'
      this.status = false
    },
    close () {
      this.$refs.chuangkou.style.height = '62px'
      this.status = true
    },
    async getData () {
      let res = await getTest()
      this.allData = res
    },
    refresh () {
      if ((this.index + 1) * 3 < this.allData.length) {
        this.items1 = this.allData.slice(this.index * 3, (this.index + 1) * 3)
        this.index++
      } else if ((this.index + 1) * 3 === this.allData.length) {
        this.items1 = this.allData.slice(this.index * 3, (this.index + 1) * 3)
        this.index = 0
      } else {
        this.items1 = this.allData.slice(this.index * 3, this.allData.length)
        this.index = 0
      }
    },
    zhankai () {
      console.log(this.shadowheight)
      this.$refs.shadow.style.height = this.$refs.items.clientHeight + 'px'
      this.up = !this.up
    },
    shouqi () {
      this.$refs.shadow.style.height = this.shadowheight + 'px'
      this.up = !this.up
    },
    openActiveType () {
      this.isOpen_active = !this.isOpen_active
      if (this.isOpen_active) {
        this.$refs.activeType.style.height = this.$refs.items1.scrollHeight + 'px'
      } else {
        this.$refs.activeType.style.height = '62px'
      }
    },
    // 风险类型展开与收起
    openDangerType () {
      this.isOpen_danger = !this.isOpen_danger
      if (this.isOpen_danger) {
        this.$refs.items.style.height = this.$refs.dangerType.scrollHeight + 'px'
      } else {
        this.$refs.items.style.height = '62px'
      }
    },
    filterControl (val) {
      this.dangerChecked = val
      if (this.isOpen_danger) {
        this.$nextTick(() => {
          this.$refs.items.style.height = this.$refs.dangerType.clientHeight + 'px'
        })
      }
    },
    htest () {
      let div = document.createElement('div')
      div.style['height'] = '10px'
      this.$refs.htest.appendChild(div)
    }
  },
  computed: {
    height () {
      console.log(this.$refs['htest'])
      if (this.$refs) {
        console.log(this.$refs['htest'])
        return this.$refs.htest
      } else {
        return 0
      }
    }
  },
  mounted () {
    this.getData()
    this.$nextTick(() => {
      this.shadowheight = this.$refs.shadow.clientHeight
    })
  }
}
</script>
<style lang="less" scoped>
.shadow {
  background: skyblue;
  overflow: hidden;
  position: relative;
  transition: 1s;
  height: 35px;
  .items {
    .item {
      line-height: 35px;
    }
  }
  .btn {
    position: absolute;
    right: 10px;
    top: 10px;
    border: 1px blue solid;
    padding: 2px 5px;
    cursor: pointer;
    border-radius: 4px;
  }
}
.list-complete-item {
  transition: all 1s;
  display: block;
  margin-right: 10px;
  background: yellow;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  height: auto;
  // transform: translateY(50px);
}
.list-complete-leave-active {
  position: absolute;
}
.zhang{
  height: 30px;
  overflow: hidden;
  transition: 2s;

  span {
    display: block;
  }
}
.chuangkou {
  height: 62px;
  background: orchid;
  position: relative;
  transition: 1s;
  button {
    position: absolute;
    top: 20px;
    right: 50px;
    &:last-child{
      right: 10px;
    }
  }
  .rongqi {
    width: 600px;
    background: gray;
    .jiedian {
      line-height: 62px;
      margin: 0 10px;
      display: inline-block;
    }
  }
}
  .type {
    width: 900px;
    padding: 0 26px;
    display: flex;
    flex-direction: column;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(235,238,243,1);
    margin-bottom: 16px;
    .activeType {
      flex: 0 0 auto;
      display: flex;
      line-height: 62px;
      border-bottom: rgba(246,246,246,1) 2px solid;
      height: 62px;
      overflow: hidden;
      transition: 0.5s;
    }
    .dangerType {
      display: flex;
      line-height: 62px;
      overflow: hidden;
      position: relative;
      .items {
        height: 62px;
        transition: 1s;
      }
    }
    .name {
      color: rgba(172,172,172,1);
      font-size: 16px;
      margin-right: 23px;
      flex: 0 0 auto;
    }
    .filter {
      flex: 0 0 auto;
      font-size:14px;
      color: rgba(255,125,125,1);
      margin-right: 50px;
      cursor: pointer;
    }
    .items {
      span {
        display: inline-block;
        font-size: 16px;
        margin-right: 35px;
        cursor: pointer;
        &.checked {
          color: rgba(39,112,238,1);
        }
        &.filter {
          color: red
        }
      }
    }
    .openRetract {
      flex: 0 0 auto;
      color: rgba(39,112,238,1);
      cursor: pointer;
      i {
        margin-left: 3px;
        transition: 0.5s;
        &.rotate {
          transform: rotate(-180deg);
        }
      }
    }
  }
  .heightTest {
    border: 1px solid #333;
  }
</style>
