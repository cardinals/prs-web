<template>
  <div class="relation">
    <!-- 头部消息提示 -->
    <div class="msg" v-if="$route.params.type!=='err' && showMsg && riskNum && riskNum !== '0'">
      <div class="icon"></div>
      <div class="text" >
        {{personName}}共有<span>{{riskNum}}</span>项<span>异常关系</span>风险预警
      </div>
      <div class="btn" @click="onlyDanger"><span>点击查看</span></div>
      <div class="del" @click="hideMsg('ralationShowMsg')"></div>
    </div>
    <!-- 人物关系图谱 -->
    <div class="peopleRelation">
      <div class="title">
        <span class="name">人物关系</span>
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
export default {
  name: 'relationship',
  props: ['personName', 'riskNum'], // 父组件传值【人名， 风险数】
  data () {
    return {
      onlyAbnormal: false // 是否只显示异常
    }
  },
  computed: {
    showMsg () {
      return this.$store.state.people.ralationShowMsg
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
    ...mapActions('people', {
      hideMsg: 'hideMsg'
    }),
    // 点击查看
    onlyDanger () {
      this.hideMsg('relationShowMsg')
      this.onlyAbnormal = true
    }
  },
  mounted () {
    this.onlyAbnormal = this.$route.params.type === 'err'
  }
}
</script>

<style lang="less">
@import '~@/assets/css/peopleRelationship.less';
</style>
