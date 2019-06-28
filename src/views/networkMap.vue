<template>
  <div class="networkMap">
    <div id="container">
      <div class="nodeLegends">
        <div class="nodeLegend"
          v-for="(item, index) in cusNodes"
          :key="index"
          :class="{'noChecked': !item.checked}"
          @click="changeNodeStatu(index)">
          <div class="legend" :style="`background: ${item.fill}`"></div>
          <div class="text"> {{item.name}} </div>
        </div>
      </div>
      <div class="edgeLegends">
        <div class="edgeLegend"
          v-for="(item, index) in cusEdges"
          :key="index"
          :class="{'noChecked': !item.checked}"
          @click="changeEdgeStatu(index)">
          <div class="legend" :style="`background: ${item.fill}`"></div>
          <div class="text"> {{item.name}} </div>
        </div>
      </div>
      <div class="moveCenter" title="回到中心点" @click="toCenter">
        <div class="icon"></div>
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
import { relation, relation2 } from '@/api/api.js'
const d3 = require('d3')
let graph = {}
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
          fill: 'rgba(56,122,238,1)'
        },
        {
          name: '重点',
          fill: 'rgba(240,63,64,1)'
        },
        {
          name: '其他',
          fill: 'rgba(35,179,215,1)',
          labelStyle: {
            stroke: '#F9F9F9'
          }
        }
      ],
      test: false
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
      if (newVal) {
        this.showAbnormal()
      } else if (this.test) {
        this.showAll()
      } else {
        this.test = true
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
    changeNodeStatu (index) {
      this.cusNodes[index].checked = !this.cusNodes[index].checked
      let shape = this.cusNodes[index].name
      let a = graph.findAll('node', node => {
        if (node.get('currentShape') === shape) {
          return node
        }
      })
      if (!this.cusNodes[index].checked) {
        a.forEach(ele => {
          graph.hideItem(ele)
          graph.paint()
        })
      } else {
        a.forEach(ele => {
          console.log(ele.getEdges())
          graph.showItem(ele)
          graph.paint()
        })
      }
    },
    changeEdgeStatu (index) {
      this.cusEdges[index].checked = !this.cusEdges[index].checked
      let shape = this.cusEdges[index].name
      let a = graph.findAll('edge', edge => {
        if (edge.get('currentShape') === shape) {
          return edge
        }
      })
      if (!this.cusEdges[index].checked) {
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
        height: height || 550,
        autoPaint: false,
        modes: {
          default: ['drag-canvas',
            // {
            //   type: 'activate-relations',
            //   activeState: 'highlight',
            //   inactiveState: 'dark'
            // },
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
          default: { opacity: 0.5 },
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
      const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(function (d) { return d.id }).strength(0.001))
        .force('charge', d3.forceManyBody().strength(-80))
        .force('center', d3.forceCenter(425, 300))
      simulation.nodes(this.G6Data.nodes).on('tick', ticked)
      simulation.force('link').links(this.G6Data.edges)

      graph.on('node:dragstart', function (e) {
        simulation.alphaTarget(0.3).restart()
        refreshPosition(e)
      })

      // 节点操作--拖拽中
      graph.on('node:drag', function (e) {
        refreshPosition(e)
      })

      // 节点操作--拖拽结束
      graph.on('node:dragend', function (e) {
        simulation.alphaTarget(0)
        refreshPosition(e)
        // 可以立即停止飘动
        // simulation.stop()
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
                    text: cfg.label,
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
                    text: cfg.label,
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
                opacity: 0.5
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
      relation2().then(res => {
        this.G6Data = res
        this.init()
      })
    },
    showAbnormal () {
      for (let i = 0; i < this.cusNodes.length; i++) {
        if (this.cusNodes[i].name === '重点' || this.cusNodes[i].name === '本人') {
          this.cusNodes[i].checked = false
        } else {
          this.cusNodes[i].checked = true
        }
        this.changeNodeStatu(i)
      }
      for (let i = 0; i < this.cusEdges.length; i++) {
        if (this.cusEdges[i].name === '重点') {
          this.cusEdges[i].checked = false
        } else {
          this.cusEdges[i].checked = true
        }
        this.changeEdgeStatu(i)
      }
      this.cusNodes = JSON.parse(JSON.stringify(this.cusNodes))
      this.cusEdges = JSON.parse(JSON.stringify(this.cusEdges))
    },
    showAll () {
      for (let i = 0; i < this.cusNodes.length; i++) {
        this.cusNodes[i].checked = false
        this.changeNodeStatu(i)
      }
      for (let i = 0; i < this.cusEdges.length; i++) {
        this.cusEdges[i].checked = false
        this.changeEdgeStatu(i)
      }
      this.cusNodes = JSON.parse(JSON.stringify(this.cusNodes))
      this.cusEdges = JSON.parse(JSON.stringify(this.cusEdges))
    }
  },
  created () {

  },
  mounted () {
    relation({
      g_id: '179363',
      flag: 2
    }).then(res => {
      this.G6Data = res.data
      this.createGraph('container')
      this.init()
      if (this.onlyErr) {
        this.showAbnormal()
      } else {
        this.showAll()
      }
      this.$emit('my-event', graph)
    })
  },
  beforeDestroy () {
    graph.destroy()
  }
}
</script>

<style lang="less">
.networkMap {
  user-select: none;
  position: relative;
  #container {
    min-height: 500px;
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
  .moveCenter {
    position: absolute;
    left: 20px;
    bottom: 20px;
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
    .icon {
      width: 20px;
      height: 20px;
      margin: auto;
      background: url('../assets/images/toCenter.png')
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
