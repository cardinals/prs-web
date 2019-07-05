<template>
  <div class="relation">
    <div class="msg" v-if="showMsg && dynamicNum !== '0'">
      <div class="icon"></div>
      <div class="text" >
        {{peopleName}}共有<span>{{dynamicNum}}</span>项<span>异常关系</span>风险预警
      </div>
      <div class="btn" @click="onlyDanger"><span>点击查看</span></div>
      <div class="del" @click="changeShowMsg(false)"></div>
    </div>
    <div class="peopleRelation">
      <div class="title">
        <span class="name">人员动态</span>
        <el-checkbox v-model="onlyAbnormal">只看异常</el-checkbox>
      </div>
      <div class="content">
        <div class="graphicContainer">
          <relation @my-event="myEvent" :onlyErr="onlyAbnormal" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import relation from './networkMap'
export default {
  name: 'relationship',
  components: {
    relation
  },
  data () {
    return {
      onlyErr: false,
      onlyAbnormal: false
    }
  },
  computed: {
    showMsg () {
      return this.$store.state.relation.showMsg
    },
    dynamicNum () {
      return this.$store.state.relation.dynamicNum
    },
    peopleName () {
      return this.$store.state.relation.peopleName
    }
  },
  watch: {
    onlyAbnormal: function (newVal, oldVal) {

    },
    $route: {
      handler: function (val, oldVal) {
        this.onlyAbnormal = this.$route.params.type === 'err'
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('relation', {
      changeShowMsg: 'changeShowMsg'
    }),
    onlyDanger () {
      this.changeShowMsg(false)
      this.onlyAbnormal = true
    },
    myEvent (ss) {
      ss.get('nodes')[0].enableCapture(false)
    }
  },
  mounted () {
    this.onlyAbnormal = this.$route.params.type === 'err'
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/peopleRelationship.less';
</style>

<style lang="less">
.el-checkbox__input.is-checked .el-checkbox__inner {
  background: #2770EE;
  border-color: #2770EE;
}
.el-checkbox .el-checkbox__label {
  padding-left: 5px;
  font-size: 14px;
  color: #000;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #000;
}

</style>
