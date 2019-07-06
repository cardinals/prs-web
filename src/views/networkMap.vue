<template>
  <div class="networkMap">
    <div id="container">
      <div class="nodeLegends">
        <div class="nodeLegend"
          v-for="(item, index) in nodeLegends"
          :key="index"
          :class="{'noChecked': !item.checked}"
          @click="changeNodeLegendStatu(index)">
          <div class="legend" :style="`background: ${item.fill}`"></div>
          <div class="text"> {{item.name}} </div>
        </div>
      </div>
      <div class="edgeLegends">
        <div class="edgeLegend"
          v-for="(item, index) in edgeLegends"
          :key="index"
          :class="{'noChecked': !item.checked}"
          @click="changeEdgeLegendsStatu(index)">
          <div class="legend" :style="`background: ${item.fill}`"></div>
          <div class="text"> {{item.name}} </div>
        </div>
      </div>
      <div class="positionControl">
        <div class="control" title="刷新页面" @click="refreshPage">
          <div class="icon refresh"></div>
        </div>
        <div class="control" title="回到中心点" @click="toCenter">
          <div class="icon moveCenter"></div>
        </div>
      </div>
      <div class="zoomControl">
        <div class="zoom bigger" @click="zoom('bigger')">+</div>
        <div class="zoom smaller" @click="zoom('smaller')">-</div>
      </div>
    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
import { relation } from '@/api/api.js'
const d3 = require('d3')
let graph = {}
let simulation = null
export default {
  name: 'networkMap',
  data () {
    return {
      G6Data: {
        nodes: [
          {
            id: 'node1',
            shape: '本人',
            label: '张晓磊',
            personId: '123465'
          },
          {
            id: 'node2',
            shape: '重点',
            label: '李爱国',
            personId: '123465'
          },
          {
            id: 'node3',
            shape: '非重点',
            label: '孙大圣',
            personId: ''
          },
          {
            id: 'node4',
            shape: '非重点',
            label: '牛魔王',
            personId: ''
          }
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2',
            shape: '重点',
            label: '同案犯'
          },
          {
            source: 'node1',
            target: 'node2',
            shape: '亲属',
            label: '表弟'
          },
          {
            source: 'node1',
            target: 'node3',
            shape: '其他',
            label: '同事'
          },
          {
            source: 'node1',
            target: 'node4',
            shape: '其他',
            label: '同事'
          },
          {
            source: 'node2',
            target: 'node4',
            shape: '其他',
            label: '同事'
          }
        ]
      },
      cusNodes: [
        {
          name: '本人',
          fill: '#F36924',
          MasterStyle: {}
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
          labelStyle: {
            stroke: '#F9F9F9'
          }
        }
      ],
      firstLoad: true,
      nodeLegends: [],
      edgeLegends: []
    }
  },
  props: {
    onlyErr: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rData: function () {
      if (this.G6Data) {
        let copyNodes = this.G6Data.nodes
        copyNodes[0].center = true
        let temp = {}
        let copyEdges = this.G6Data.edges
        // 将起点终点相同边归集
        copyEdges.map((item) => {
          item.labelCfg = {}
          item.labelCfg.autoRotate = true
          if (!temp[`${item.source}-${item.target}`]) {
            temp[`${item.source}-${item.target}`] = []
          }
          temp[`${item.source}-${item.target}`].push(item)
        })
        copyEdges = []
        // 设置起点终点相同边的偏转角度
        for (const key in temp) {
          if (temp.hasOwnProperty(key)) {
            if (temp[key].length % 2 === 0) {
              const layoutMap = [Math.PI / 14, -Math.PI / 14, Math.PI / 4, -Math.PI / 4]
              temp[key].map((it, index) => {
                it.angle = layoutMap[index]
                copyEdges.push(it)
              })
            }
            if (temp[key].length % 2 === 1) {
              const layoutMap = [0, Math.PI / 9, -Math.PI / 9, Math.PI / 4, -Math.PI / 4]
              temp[key].map((it, index) => {
                it.angle = layoutMap[index]
                copyEdges.push(it)
              })
            }
          }
        }
        const result = {
          nodes: copyNodes,
          edges: copyEdges
        }
        return result
      } else {
        return {}
      }
    }
  },
  watch: {
    onlyErr: function (newVal, oldVal) {
      if (graph.findAll && newVal) {
        this.showAbnormal()
      } else {
        this.showAll()
      }
    }
  },
  methods: {
    zoom (val) {
      if (val === 'bigger') graph.zoom(2, { x: 425, y: 200 })
      if (val === 'smaller') graph.zoom(0.5, { x: 425, y: 200 })
      graph.paint()
    },
    toCenter () {
      graph.findAll('node', node => {
        if (node.getModel().center) {
          graph.focusItem(node)
          graph.paint()
        }
      })
    },
    changeNodeLegendStatu (index) {
      this.nodeLegends[index].checked = !this.nodeLegends[index].checked
      let shape = this.nodeLegends[index].name
      let a = graph.findAll('node', node => {
        if (node.get('currentShape') === shape) {
          return node
        }
      })
      if (!this.nodeLegends[index].checked) {
        a.forEach(ele => {
          graph.hideItem(ele)
          graph.paint()
        })
      } else {
        a.forEach(ele => {
          graph.showItem(ele)
          graph.paint()
        })
      }
    },
    changeEdgeLegendsStatu (index) {
      this.edgeLegends[index].checked = !this.edgeLegends[index].checked
      let shape = this.edgeLegends[index].name
      let a = graph.findAll('edge', edge => {
        if (edge.get('currentShape') === shape) {
          return edge
        }
      })
      if (!this.edgeLegends[index].checked) {
        a.forEach(ele => {
          graph.hideItem(ele)
          graph.paint()
        })
      } else {
        a.forEach(ele => {
          graph.showItem(ele)
          graph.paint()
        })
      }
    },
    // 对自定义节点样式传参进行默认值的配置
    nodeDefaultConf (cusNode) {
      cusNode.fill = cusNode.fill || 'skyblue'
      cusNode.stroke = cusNode.stroke || 'skyblue'
      cusNode.lineWidth = cusNode.lineWidth || 0
      cusNode.cursor = cusNode.cursor || 'pointer'
      cusNode.opacity = 1
      if (cusNode.MasterStyle) {
        cusNode.r = cusNode.r || 40
        cusNode.MasterStyle.rs = cusNode.MasterStyle.rs || cusNode.r
        cusNode.MasterStyle.re = cusNode.MasterStyle.re || cusNode.r + 5
        cusNode.MasterStyle.fill = cusNode.MasterStyle.fill || cusNode.fill
        cusNode.MasterStyle.stroke = cusNode.MasterStyle.stroke || cusNode.fill
        cusNode.MasterStyle.lineWidth = cusNode.MasterStyle.lineWidth || 0
        cusNode.MasterStyle.opacity = cusNode.MasterStyle.opacity || 0.4
        cusNode.MasterStyle.cursor = cusNode.cursor
      } else {
        cusNode.r = cusNode.r || 32
      }
      if (cusNode.labelStyle) {
        cusNode.labelStyle.x = cusNode.labelStyle.x || 0
        cusNode.labelStyle.y = cusNode.labelStyle.y || 0
        cusNode.labelStyle.fill = cusNode.labelStyle.fill || '#fff'
        cusNode.labelStyle.stroke = cusNode.labelStyle.stroke || '#fff'
        cusNode.labelStyle.lineWidth = cusNode.labelStyle.lineWidth || 0
        cusNode.labelStyle.fontSize = cusNode.labelStyle.fontSize || 12
        cusNode.labelStyle.fontWeight = cusNode.labelStyle.fontWeight || 400
        cusNode.labelStyle.textAlign = cusNode.labelStyle.textAlign || 'center'
        cusNode.labelStyle.textBaseline = cusNode.labelStyle.textBaseline || 'middle'
        cusNode.labelStyle.opacity = cusNode.labelStyle.opacity || 1
      }
      return cusNode
    },
    // 对自定义边样式传参进行默认值的配置
    edgeDefaultConf (cusEdge) {
      cusEdge.fill = cusEdge.fill || '#333'
      cusEdge.lineWidth = cusEdge.lineWidth || 1
      cusEdge.opacity = cusEdge.opacity || 0.5
      if (cusEdge.labelStyle) {
        cusEdge.labelStyle.fontSize = cusEdge.labelStyle.fontSize || 12
        cusEdge.labelStyle.fill = cusEdge.labelStyle.fill || '#333'
        cusEdge.labelStyle.stroke = cusEdge.labelStyle.stroke || '#fff'
        cusEdge.labelStyle.lineWidth = cusEdge.labelStyle.lineWidth || 5
      }
      return cusEdge
    },
    createGraph (container, width, height) {
      graph = new G6.Graph({
        container: container,
        width: width || 840,
        height: height || 680,
        autoPaint: false,
        modes: {
          default: ['drag-canvas',
            {
              type: 'tooltip',
              formatText (model) {
                if (model.label.length > 5) {
                  return model.label
                } else {
                  return ''
                }
              }
            },
            'zoom-canvas',
            'drag-node']
        },
        nodeStyle: {
          default: {
            opacity: 1
          },
          highlight: {
            opacity: 1
          },
          dark: {
            opacity: 0.1
          }
        },
        edgeStyle: {
          default: { opacity: 0.6 },
          highlight: { opacity: 1 },
          dark: { opacity: 0.1 }
        }
      })
    },
    init () {
      graph.data({ nodes: this.rData.nodes,
        edges: this.rData.edges.map((edge, i) => {
          edge.id = 'edge' + i
          return Object.assign({}, edge)
        })
      })
      const ticked = () => {
        graph.refreshPositions()
        graph.paint()
      }

      // 根据新坐标重新绘制节点
      const refreshPosition = (e) => {
        e.item.get('model').x = e.x
        e.item.get('model').y = e.y
        graph.refreshPositions()
      }
      simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(function (d) { return d.id }).strength(0.001))
        .force('charge', d3.forceManyBody().strength(-80))
        .force('center', d3.forceCenter(425, 300))
      simulation.nodes(this.G6Data.nodes).on('tick', ticked)
      simulation.force('link').links(this.G6Data.edges)

      graph.on('node:dragstart', function (e) {
        simulation.alphaTarget(0.3).restart()
        refreshPosition(e)
        simulation.stop()
      })

      // 节点操作--拖拽中
      graph.on('node:drag', function (e) {
        refreshPosition(e)
        simulation.stop()
      })

      // 节点操作--拖拽结束
      graph.on('node:dragend', function (e) {
        simulation.alphaTarget(0)
        refreshPosition(e)
        // 可以立即停止飘动
        simulation.stop()
      })

      // 节点操作--停止飘动
      let _this = this
      graph.on('node:click', function (e) {
        simulation.stop()
        _this.clickPerson(e)
      })
      this.registerNodes()
      this.registerEdges()
      this.registerBehaviors()

      graph.render()
    },
    // 自定义边（关系）
    registerEdges () {
      let _this = this
      let regist = (cusEdge) => {
        cusEdge = _this.edgeDefaultConf(cusEdge)
        G6.registerEdge(cusEdge.name, {
          getPath (points) {
            const path = []
            path.push(['M', points[0].x, points[0].y])
            path.push(['L', points[1].x, points[1].y])
            return path
          },
          // 控制点不生效
          getControlPoints () {
            return []
          },
          getShapeStyle (cfg) {
            cfg = this.getPathPoints(cfg)
            let startPoint = cfg.startPoint
            let endPoint = cfg.endPoint
            _this.lineDeviation(cfg)
            let controlPoints = this.getControlPoints(cfg)
            let points = [startPoint] // 添加起始点
            let opacity = cfg.style.opacity
            let lineWidth = cfg.style.lineWidth || cusEdge.lineWidth
            let cusFontSize = 12
            if (cusEdge.labelStyle) {
              cusFontSize = cusEdge.labelStyle.fontSize
            }
            // 添加控制点
            if (controlPoints) {
              points = points.concat(controlPoints)
            } // 添加结束点
            // let middlePoint = (cusEdge.lineWidth / 2) || 0.5
            // let topPoint = (cusEdge.lineWidth + 4) || 5
            let endArrow = {
              path: 'M 8,0.5 L -4,-4 L -4,4 Z', // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的
              d: startPoint.y > endPoint.y ? 4 : -4
            }
            points.push(endPoint)
            let path = this.getPath(points)
            let style = {
              stroke: cusEdge.fill,
              lineWidth: lineWidth,
              path: path,
              endArrow: endArrow,
              opacity: opacity,
              cusFontSize: cusFontSize
            }
            return style
          },
          drawLabel (cfg, group) {
            const labelCfg = cfg.labelCfg || {}
            let labelStyle = this.getLabelStyle(cfg, labelCfg, group)
            if (cusEdge.labelStyle) {
              labelStyle = cusEdge.labelStyle
            } else {
              labelStyle.fontSize = labelCfg.fontSize || 12
              labelStyle.stroke = labelCfg.stroke || '#F9F9F9'
              labelStyle.fill = labelCfg.fill || '#333'
              labelStyle.lineWidth = labelCfg.lineWidth || 5
            }
            const label = group.addShape('text', {
              attrs: labelStyle
            })
            return label
          }
        }, 'single-line')
      }
      this.cusEdges.forEach(ele => {
        regist(ele)
      })
      graph.refresh()
    },
    // 自定义节点（人物）
    registerNodes () {
      const regist = (cusNode) => {
        // 节点样式默认配置
        cusNode = this.nodeDefaultConf(cusNode)
        G6.registerNode(cusNode.name, {
          draw (cfg, group) {
            const clip = group.addShape('circle', {
              attrs: {
                x: 0,
                y: 0,
                r: cusNode.r,
                fill: cusNode.fill,
                fillOpacity: cusNode.fillOpacity || cusNode.opacity,
                stroke: cusNode.stroke,
                strokeOpacity: cusNode.strokeOpacity || cusNode.opacity,
                lineWidth: cusNode.lineWidth,
                cursor: cusNode.cursor
              }
            })
            if (cfg.personId !== '' && !cusNode.MasterStyle) {
              openShape(group)
            }
            if (cusNode.MasterStyle) {
              group.addShape('fan', {
                attrs: {
                  x: 0,
                  y: 0,
                  rs: cusNode.MasterStyle.rs,
                  re: cusNode.MasterStyle.re,
                  startAngle: 0,
                  endAngle: 2 * Math.PI,
                  fill: cusNode.MasterStyle.fill,
                  fillOpacity: cusNode.MasterStyle.fillOpacity || cusNode.MasterStyle.opacity,
                  stroke: cusNode.MasterStyle.stroke,
                  lineWidth: cusNode.MasterStyle.lineWidth,
                  strokeOpacity: cusNode.MasterStyle.fillOpacity || cusNode.MasterStyle.opacity,
                  cursor: cusNode.MasterStyle.cursor
                }
              })
            }
            if (cfg.label) {
              if (cusNode.labelStyle) {
                group.addShape('text', {
                  attrs: {
                    x: cusNode.labelStyle.x, // 居中
                    y: cusNode.labelStyle.y,
                    textAlign: cusNode.labelStyle.textAlign,
                    textBaseline: cusNode.labelStyle.textBaseline,
                    fontSize: cusNode.labelStyle.fontSize,
                    text: cfg.label.length > 5 ? cfg.label.substring(0, 4) + '...' : cfg.label,
                    fill: cusNode.labelStyle.fill,
                    opacity: cusNode.labelStyle.opacity
                  }
                })
              } else {
                group.addShape('text', {
                  attrs: {
                    x: 0, // 居中
                    y: 0,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontSize: 14,
                    text: cfg.label.length > 5 ? cfg.label.substring(0, 4) + '...' : cfg.label,
                    fill: '#fff',
                    opacity: 1
                  }
                })
              }
            }

            return clip
          }
        })
      }
      const openShape = (group) => {
        group.addShape('circle', {
          attrs: {
            x: 38 * Math.sqrt(1 / 2),
            y: 38 * Math.sqrt(1 / 2),
            r: 3,
            fill: '#A3A3A3',
            cursor: 'pointer'
          }
        })
        group.addShape('circle', {
          attrs: {
            x: 38 * Math.sqrt(1 / 2) + 20,
            y: 38 * Math.sqrt(1 / 2),
            r: 8,
            fill: '#A3A3A3',
            cursor: 'pointer'
          }
        })
        group.addShape('path', {
          attrs: {
            //  / 1 \
            // 4     2
            //  \ 3 /
            path: [
              ['M', 38 * Math.sqrt(1 / 2) + 3, 38 * Math.sqrt(1 / 2)], // 上部顶点
              ['L', 38 * Math.sqrt(1 / 2) + 12, 38 * Math.sqrt(1 / 2)]// 右侧点
            ],
            stroke: '#A3A3A3' // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
          }
        })
        group.addShape('text', {
          // attrs: style
          attrs: {
            x: 38 * Math.sqrt(1 / 2) + 20, // 居中
            y: 38 * Math.sqrt(1 / 2) + 1,
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 16,
            fontWeight: 800,
            text: '+',
            fill: '#fff'
          }
        })
      }
      this.cusNodes.forEach(ele => {
        regist(ele)
      })
      graph.refresh()
    },
    // 自定义行为（交互）
    registerBehaviors () {
      let _this = this
      G6.registerBehavior('zmmCus', {
        getEvents () {
          return {
            'node:mouseenter': 'changeLabelIn',
            'node:mouseleave': 'changeLabelOut'
          }
        },
        changeLabelIn (e) {
          _this.addEdge = e.item.get('edges')
          _this.addEdge.forEach(element => {
            element.update({
              style: {
                opacity: 1,
                lineWidth: element.get('originStyle').lineWidth
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  fontWeight: 600,
                  fontSize: element.get('originStyle').cusFontSize + 2
                }
              }
            })
            graph.paint()
          })
        },
        changeLabelOut (e) {
          _this.addEdge = e.item.get('edges')
          _this.addEdge.forEach(element => {
            element.update({
              style: {
                opacity: 0.6
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  fontWeight: 400,
                  fontSize: element.get('originStyle').cusFontSize
                }
              }
            })
            graph.paint()
          })
        }
      })
      graph.addBehaviors('zmmCus', 'default')
    },
    lineDeviation (cfg) {
      let angle = cfg.angle
      const startPoint = cfg.startPoint
      const endPoint = cfg.endPoint
      const startX = cfg.sourceNode._cfg.model.x
      const startY = cfg.sourceNode._cfg.model.y
      const endX = cfg.targetNode._cfg.model.x
      const endY = cfg.targetNode._cfg.model.y
      const L = Math.sqrt(Math.pow(startY - endY, 2) + Math.pow(endX - startX, 2))
      const sinA = (startY - endY) / L
      const cosA = (endX - startX) / L
      startPoint.y = startY - 45 * (sinA * Math.cos(angle) + cosA * Math.sin(angle))
      startPoint.x = startX + 45 * (cosA * Math.cos(angle) - sinA * Math.sin(angle))
      endPoint.y = endY + 45 * (sinA * Math.cos(angle) - cosA * Math.sin(angle))
      endPoint.x = endX - 45 * (cosA * Math.cos(angle) + sinA * Math.sin(angle))
    },
    add () {
      graph.render()
      graph.paint()
    },
    clickPerson (e) {
      let id = e.item.getModel().personId
      if (id !== '') {
        relation({
          g_id: id,
          flag: id !== this.$route.params.personId ? 1 : 2
        }).then(res => {
          this.G6Data = res.data
          if (graph !== null) graph.destroy()
          this.createGraph('container')
          this.init()
          if (this.onlyErr) {
            this.showAbnormal()
          } else {
            this.showAll()
          }
        })
      }
    },
    showAbnormal () {
      for (let i = 0; i < this.nodeLegends.length; i++) {
        if (this.nodeLegends[i].name === '重点' || this.nodeLegends[i].name === '本人') {
          this.nodeLegends[i].checked = false
        } else {
          this.nodeLegends[i].checked = true
        }
        this.changeNodeLegendStatu(i)
      }
      console.log(this.nodeLegends)
      for (let i = 0; i < this.edgeLegends.length; i++) {
        if (this.edgeLegends[i].name === '重点') {
          this.edgeLegends[i].checked = false
        } else {
          this.edgeLegends[i].checked = true
        }
        this.changeEdgeLegendsStatu(i)
      }
      this.nodeLegends = JSON.parse(JSON.stringify(this.nodeLegends))
      this.edgeLegends = JSON.parse(JSON.stringify(this.edgeLegends))
    },
    showAll () {
      for (let i = 0; i < this.nodeLegends.length; i++) {
        this.nodeLegends[i].checked = false
        this.changeNodeLegendStatu(i)
      }
      for (let i = 0; i < this.edgeLegends.length; i++) {
        this.edgeLegends[i].checked = false
        this.changeEdgeLegendsStatu(i)
      }
      this.nodeLegends = JSON.parse(JSON.stringify(this.nodeLegends))
      this.edgeLegends = JSON.parse(JSON.stringify(this.edgeLegends))
    },
    initLegends (data) {
      let nodesSet = new Set()
      let edgesSet = new Set()
      data.nodes.forEach(ele => {
        nodesSet.add(ele.shape)
      })
      data.edges.forEach(ele => {
        edgesSet.add(ele.shape)
      })
      nodesSet.forEach(ele => {
        this.cusNodes.forEach(eles => {
          if (eles.name === ele) {
            this.nodeLegends.push({ name: ele, fill: eles.fill })
          }
        })
      })
      edgesSet.forEach(ele => {
        this.cusEdges.forEach(eles => {
          if (eles.name === ele) {
            this.edgeLegends.push({ name: ele, fill: eles.fill })
          }
        })
      })
    }
  },
  created () {

  },
  mounted () {
    let gIdd = this.$route.params.personId
    relation({
      g_id: gIdd,
      flag: 2
    }).then(res => {
      this.G6Data = res.data
      this.initLegends(this.G6Data)
      this.createGraph('container')
      this.init()
      if (this.onlyErr) {
        this.showAbnormal()
      } else {
        this.showAll()
      }
    })
  },
  beforeDestroy () {
    simulation.stop()
    graph.destroy()
  }
}
</script>

<style lang="less">
.networkMap {
  user-select: none;
  position: relative;
  #container {
    min-height: 650px;
  }
  .nodeLegends {
    position: absolute;
    right: 20px;
    top: 20px;
    .nodeLegend {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        .legend {
          opacity: 1;
        }
        .text {
          font-weight: 600;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      .legend {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        margin-top: 1px;
        margin-right: 5px;
        opacity: 0.8;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
      &.noChecked {
        .legend {
          background: rgb(201, 201, 201) !important;
        }
        .text {
          color: rgb(201, 201, 201);
        }
      }
    }
  }
  .edgeLegends {
    position: absolute;
    left: 20px;
    top: 20px;
    .edgeLegend {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &:hover {
        .legend {
          opacity: 1;
        }
        .text {
          font-weight: 600;
        }
      }
      .legend {
        display: inline-block;
        width: 30px;
        height: 2px;
        border-radius: 2px;
        margin-right: 5px;
        opacity: 0.5
      }
      .text {
        display: inline-block;
        font-size: 12px;
      }
      &.noChecked {
        .legend {
          background: rgb(201, 201, 201) !important;
        }
        .text {
          color: rgb(201, 201, 201);
        }
      }
    }
  }
  .positionControl {
    position: absolute;
    left: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    .control {
      width: 30px;
      height: 30px;
      background: #fff;
      display: flex;
      align-items: center;
      border-radius: 50%;
      box-shadow:0px 0px 5px 2px rgba(226,226,226,1);
      cursor: pointer;
      &:hover {
        box-shadow:0px 0px 10px 5px rgb(226, 226, 226);
      }
      &:first-child{
        margin-bottom: 3px;
      }
      .icon {
        width: 20px;
        height: 20px;
        margin: auto;
        &.refresh{
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACHklEQVQ4T62UP2jTQRTH37sfMcGfiDgoRERwcBBKFdIhUJGM/sLdhSARpDgIXVwyKA5OopNYEDp0cegeIeTukpSIEDspqKgIgqMiqEhBJGqwyX0lhUpq80/aW9/j8773vu89pl1+vMs8Ggl0zh0horT3/jgzrwkhXoVh+DqTyXSGCRkIbDab+1qt1k0ApwCsMPM7Zm4BOA3gAjM/TCaTt1Op1Pq/4G3AWq12rNPpLAshbkkpHw9S4pyLABTb7bYsFAq/+3O2AEul0p54PN7sdrsqn8+vjepvtVo9472fV0pdGgp0zp3vdrvfcrnco0nMstbeY+ZVKWVlM39HLpfL5UNBEJS11rMDgdbaGaXUs0nUGWMyRHSWiOaJ6L4Q4r2UcvmvQmPMZWZeApDWWr8cB200GmG73X7CzFMAfgFI5XK5txvASqVyUgjxgogSAD7FYrHpKIq+joMaYw4T0VMiKmqtbS9/A+icu+i9P8HMVwAsMfNzpVR1HLAXr9fr+6Mo+j6wh8aYqhBiYdj8TVJgi8vW2lkAC0qpNDNjHMAYM8fMB5VSi0PHxlq7CGBda311FNA5N+29v6OUOtdffNsclkqlIJFIrBDRxyAIbmSz2c/9YOfcXu99kYhmhBBzUsqfQzdlMwBAOOeuA7jGzG8ArDJzCKB3dY4CuKu1fjDoByM3pac2DMMp7/0BAD8AfNBafxnVih2t3n8rHOfyoPgf7dboFcCf4SYAAAAASUVORK5CYII=);
          &:hover{
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACL0lEQVQ4T62Tz0sUYRjHv8+Mrqbr6sxCHSICwQ4LZlHrtGJEx4I6JUFIh8BLlz20VDt7GQp8NxQCDx7q4B8QRIQgRJCemtl1sQiEjkVQUTuzpRnNru8TLSRrzv4Ifa/Pw+f5vs/3+xD2+NEe89AQmMhsHJTSTxBkvwQXidVX+zp7Xy9aVKknJBAYszjc45csgjzGwAIzvVWY1qUijxPjMgjPKl/1u4UHVP4XvAM4kvEObzLPkaQ7dlZbDFJipN3zACfXOvQLqxb5tT3bgDGLQxHfeyG57WJORIqN9jucdk8TMOEI/WpdoJEuXSJGyc72PW/FLCNdvM9QlnJCe/K3f1cuj6TW9sv28mNb6KOBwPjtb/F8tjffkjrTO0uQZ8CYAOEhs/LOEdrclkLD9K4R82yFKbGc1VaaQY+muLur3XsJwiCYfzJw0hHR1SrQSBdjRCgA1Mngjz6HhlZEz5dmUMNcP0Ds2wAlbaE9/dNfBQ6b7hUFfARM10E8K5mWc0KfbwasirGKEceKfg/coWG68yRpul7+WhmwzWUj445C8rQj9ARA3AxgmO44Mem20GbqxuaU6c6AqWwL7UbDYN/yhkiV95xJ/Vzt8J05HGPVGHAXwPggKx1mfir8qRZ8wuKuNt9LEjheDunjBYs26l7KVsFixfjl3QSQIuANiJeYqZvA/QAOScZULht9FPSDxpcyxmp8oDSoSvRtQvmhKOp7ZzL8udEqdnV6/6+wmc0B9d8IKtwVA0TZ0gAAAABJRU5ErkJggg==);
          }
        }
        &.moveCenter{
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACZ0lEQVQ4T62UT2gTQRTGvzdJSZQuqEeFFhQPglR7UXtQWIoeupkZBIngRRCPSntRVJSCUCrowYieFHrzEFQyk6QgWBbqodJLiwiCiKKil4IKK+jSZJ9sSco2/ZNU3Nt87+1v3pv55hH+80ed8IwxF4QQLKV80C5/Q6AxxhFCDDLzMDOzEOIeEb3O5XIf1gOvCSyXy3ujKLpORCeYeR7A9gbgB4ABAB9TqdSZXC73thW8CmiM6SeiKWaeCMPwcj6fr1trx+MKtdbXisViKpvN3gFwlpkHtdZzSegKoLW2h5lnhBCnpJQzzcQksKkZY84BGE+n04c8z/vU1FuBTwDMKaXGkrtaa28CYKXUaFI3xtwAcFxrfWwV0Bizk4jmHcfpcV33T/JH3/e747Xrur9a9GwQBF+IyJNSzsax5QqttSMA9iulzrezRkv1jwC8V0rdWgIWi8UtmUxmhIhOMnNcwfRSgOinlLJARJwEMDOVy+XYRtsaetyuA+BZGIZ34+DWKIqGYyCAgJlfbgZIREcBdDNzSQhRWG7ZGHOViPb8Q8sPmfmN1rqw4gxLpdJhIqp2dXXtGhoaClsvZWFhoZ7P538n9cnJyczi4uJXAH1a628rgPHCGDNNRM83YZu4q4NKqdNr+rBarfbWarVZIcQVKeXERsa21h5h5qdENKCU+rwmsFFlPwCfiCYcx7nkum4t+VJ8308HQXC7o6fX3KVSqeyr1+uPiagXwCtm3tG4+e/MfADAi3Q6PeZ53ru2wyGZUKlUdjNzXzy+GsBCFEVTWutgPfN3NGCttRcb0+Z+u1fUEbAdJBn/C9fFNE4GngWTAAAAAElFTkSuQmCC);
          &:hover{
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACjUlEQVQ4T62US2gTYRDH579JjdXWZjcHQaEVrQdFqqWlmyoWoejFk6AIXgTxaGk9WLPbiouYbKyCxsdJoTcvPvDiQbAoFc2DSouIghTrA8VLdlNaqX3kG9locLevpOB3+/4z32+Y+WYG9J8PyuG1RKxTkIjTMeVWKf9lgXu6uXrWl2uXiDsZxMy4LhhvhuLBj0uBFwWqveNbSeR7ifkACCNMLDsAEGwmaiXQGKSKY6mL1e/ngxcAmyN2ox88QIT+1Giwm+4hr2qWSSikrNMR9qn11hUQjs8x2ofi8rAb6gE2nbVqKyROCqLDGTOULDp6gH9FVbdPgIUpSVLLq6j8uejrAap69j4Iw6mYEnVHVfXsBWLitBk679Xtc8S8P20qbQuAjd0/NwR80yM/AnLtJwO/3A+3G1zl3N8ZmHTrmwxevX7G/irBdzAZrcn8qXMxBc3uAokdKTN0slRruO1hLXuHCaNpU4kXgK2nuVJU2l1gPsTAJIgHHQOzlEubwQQR2BuAoWq5TkAEC36ENiKuJsJDaUq+hiaD1/hn7M4CkGgCoBcrAjLtBaiKCY/mVsmJfynrlgbmLStOWbdvM9HbdExOeGoY1sZVpvzj7KS8cfQGpud/Ss045ZNXMeXW6zs4EKqyv83kAw3DfWu/e4DORdWsQYCelN82lgaiXamYcnTRPtzdY9cJITJMUiRtyv3LNnZPNgxBD2YFWl9fUr4sCnREZ/R84GdE3F8ZUM48NzDnnpR9Bvunpq3LZY1eMUq4d2Ibi9m7YKojUIqZlUJ9AIuYdzLwlNkfzZjrPpRcDm6H5khuswRucNaXowtCoiIfHHjZh4mlmr+sBRvW7Q4hmDNx5WapKSoLWAritv8GHrEvkoqlHR4AAAAASUVORK5CYII=);
          }
        }
      }
    }
  }

  .zoomControl {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    box-shadow:0px 4px 6px 0px rgba(159,159,159,0.2);
    .zoom {
      width: 24px;
      height: 24px;
      background: #fff;
      line-height: 24px;
      text-align: center;
      font-size: 21px;
      cursor: pointer;
      color: #4C83FE;
      &.bigger{
        border-bottom: 1px #EFEFEF solid;
      }
      &.smaller {
        font-size: 21px;
      }
      &:hover {
        box-shadow:0px 0px 2px 2px rgba(159,159,159,0.2);
      }
    }
  }
}
</style>
