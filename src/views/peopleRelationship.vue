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
          <relation
          @clickNode="clickNode"
          @nodeLegendClick="nodeLegendClick"
          :data="data"
          :legend="legend"
          :controler="controler"
          :cusNodes="cusNodes"
          :cusEdges="cusEdges"
          :showKeyNodes="showKeyNodes" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { relation } from '@/api/api.js'
export default {
  name: 'relationship',
  props: ['personName', 'riskNum'], // 父组件传值【人名， 风险数】
  data () {
    return {
      onlyAbnormal: false, // 是否只显示异常
      data: {}, // 关系图数据
      legend: {
        showEdgeLegend: true,
        showNodeLegend: true
      },
      controler: {
        refreshBtn: true,
        positionBtn: true,
        zoomBtn: true
      },
      cusNodes: [
        {
          name: '本人',
          fill: '#F36924',
          // opacity: 0.1,
          MasterStyle: {},
          labelStyle: {
            // fontWeight: 800
          }
        },
        {
          name: '重点',
          fill: '#F03F40'
        },
        {
          name: '非重点',
          fill: '#387AEE'
        }
      ],
      cusEdges: [
        {
          name: '亲属',
          fill: '#75be43',
          lineWidth: 2
        },
        {
          name: '重点',
          fill: 'rgba(240,63,64,1)',
          lineWidth: 2
        },
        {
          name: '其他',
          fill: '#387aee',
          lineWidth: 2,
          // opacity: 0.1,
          labelStyle: {
            // fill: 'red',
            stroke: '#F9F9F9'
          }
        }
      ],
      showKeyNodes: []
    }
  },
  computed: {
    showMsg () {
      return this.$store.state.people.ralationShowMsg
    }
  },
  watch: {
    onlyAbnormal: function (newVal, oldVal) {
      if (newVal) {
        this.showKeyNodes = ['本人', '重点']
      } else {
        this.showKeyNodes = []
      }
    },
    $route: {
      handler: function (val, oldVal) {
        console.log('route change')
        this.onlyAbnormal = this.$route.params.type === 'err'
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('people', {
      hideMsg: 'hideMsg'
    }),
    clickNode (e) {
      let id = e.item.getModel().personId
      if (id !== '') {
        relation({
          g_id: id,
          flag: id !== this.$route.params.personId ? 1 : 2
        }).then(res => {
          res.data.nodes.map(x => {
            if (x.personId !== '') {
              x.expanded = true
            }
            return x
          })
          this.data = res.data
        })
      }
    },
    // 点击查看
    onlyDanger () {
      this.hideMsg('ralationShowMsg')
      this.onlyAbnormal = true
    },
    nodeLegendClick (legends) {
      let res = true
      legends.forEach(ele => {
        res = res && ele.checked
      })
      if (res) {
        this.onlyAbnormal = false
      }
    }
  },
  mounted () {
    this.onlyAbnormal = this.$route.params.type === 'err'
    let gIdd = this.$route.params.personId
    relation({
      g_id: gIdd,
      flag: 2
    }).then(res => {
      res.data.nodes.map(x => {
        if (x.personId !== '') {
          x.expanded = true
        }
        return x
      })
      this.data = res.data
    })
  }
}
</script>

<style lang="less">
@import '~@/assets/css/peopleRelationship.less';
</style>
