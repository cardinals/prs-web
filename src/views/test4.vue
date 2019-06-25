<template>
  <div class="test2">
    <div id="container" style="background: #fff">
    </div>
    <div style="margin-bottom: 100px;">
      <el-button type="primary" @click="add">addNodedges</el-button>
    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
const d3 = require('d3')
let graph = {}
export default {
  name: 'test2',
  data () {
    return {
      G6Data: {
        nodes: [
          {
            id: 'node1',
            shape: '本人',
            label: '李小磊',
            personId: '123456'
          },
          {
            id: 'node2',
            label: '常来风',
            shape: '重点',
            personId: '132466'
          },
          {
            id: 'node3',
            label: '老下雨',
            shape: '重点',
            personId: '132466'
          },
          {
            id: 'node4',
            label: '老下雨',
            shape: 'test',
            personId: '132466'
          },
          {
            id: 'node5',
            label: '老下雨',
            shape: 'circle',
            personId: '132466',
            x: 200,
            y: 200,
            style: {
              fill: 'green'
            }
          },
          {
            id: 'node6',
            label: '老下雨',
            shape: 'circle',
            personId: '132466',
            x: 300,
            y: 200,
            style: {
              fill: 'green'
            }
          }
        ],
        edges: [
          {
            target: 'node2',
            source: 'node1',
            label: '亲属',
            shape: 'zmm'
          },
          {
            target: 'node3',
            source: 'node1',
            label: '亲属',
            shape: 'zmm1'
          },
          {
            target: 'node4',
            source: 'node1',
            label: '亲属',
            shape: 'zmm1'
          },
          {
            target: 'node5',
            source: 'node6',
            label: '亲属'
          }
        ]
      },
      addEdge: []
    }
  },
  computed: {
    rData: function () {
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
        nodes: this.G6Data.nodes,
        edges: copyEdges
      }
      return result
    }
  },
  methods: {
    createGraph (container, width, height) {
      graph = new G6.Graph({
        container: container,
        width: width || 1000,
        height: height || 800,
        autoPaint: false,
        modes: {
          default: ['drag-canvas',
            'zoom-canvas',
            'drag-node']
        },
        nodeStyle: {
          default: {
            opacity: 0.5
          },
          selected: {
            opacity: 1
          },
          zmmStatu: {
            opacity: 0.2
          }
        },
        edgeStyle: {
          default: { opacity: 0.5 },
          selected: { opacity: 1 }
        },
        edgeLabelStyle: {
          default: {
            fontSize: 14
          },
          selected: { fontSize: 20 }
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
        .force('center', d3.forceCenter(500, 300))
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
      graph.on('node:drag', (e) => {
        e.item.get('model').x = e.x
        e.item.get('model').y = e.y
        graph.refreshPositions()
      })
      graph.on('node:mouseenter', e => {
        // graph.clearItemStates(e.item, 'zmmStatu')
        // graph.setItemState(e.item, 'selected', true)
        // const edges = e.item.getEdges()
        // edges.forEach(ele => {
        //   graph.clearItemStates(ele, 'zmmStatu')
        //   graph.setItemState(ele, 'selected', true)
        // })
        // graph.paint()
      })
      graph.on('node:mouseleave', e => {
        // graph.clearItemStates(e.item, 'selected')
        // graph.setItemState(e.item, 'zmmStatu', true)
        // const edges = e.item.getEdges()
        // edges.forEach(ele => {
        //   graph.clearItemStates(ele, 'selected')
        //   graph.setItemState(ele, 'zmmStatu', true)
        // })
        // graph.paint()
      })
      this.registerNodes()
      this.registerEdges()
      this.registerBehaviors()
      graph.addBehaviors('zmmCus')
      graph.render()
      // graph.getEdges()
    },
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
          e.item.update({
            style: {
              opacity: 1
            }
          })
          _this.addEdge = e.item.get('edges')
          _this.addEdge.forEach(element => {
            element.update({
              style: {
                opacity: 1
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  stroke: '#fff',
                  lineWidth: 5,
                  fontSize: 14
                }
              }
            })
            graph.paint()
          })
        },
        changeLabelOut (e) {
          e.item.update({
            style: {
              opacity: 0.5
            }
          })
          _this.addEdge = e.item.get('edges')
          _this.addEdge.forEach(element => {
            element.update({
              style: {
                opacity: 0.1
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  stroke: '#fff',
                  lineWidth: 5,
                  fontSize: 12
                }
              }
            })
            graph.paint()
          })
        }
      })
      graph.addBehaviors('zmmCus', 'default')
    },
    registerEdges () {
      let _this = this
      let regist = (edgeName, color) => {
        G6.registerEdge(edgeName, {
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
            var size = cfg.size || 1
            cfg = this.getPathPoints(cfg)
            var startPoint = cfg.startPoint
            var endPoint = cfg.endPoint
            _this.lineDeviation(cfg)
            var controlPoints = this.getControlPoints(cfg)
            var points = [startPoint] // 添加起始点
            var opacity = cfg.style.opacity
            // 添加控制点
            if (controlPoints) {
              points = points.concat(controlPoints)
            } // 添加结束点
            let endArrow = {
              path: 'M 8,0 L -4,-4 L -4,4 Z', // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的
              d: startPoint.y > endPoint.y ? 4 : -4
            }
            points.push(endPoint)
            var path = this.getPath(points)
            var style = {
              stroke: color,
              lineWidth: size,
              path: path,
              endArrow: endArrow,
              opacity: opacity
            }
            return style
          },
          drawLabel (cfg, group) {
            const labelCfg = cfg.labelCfg || {}
            const labelStyle = this.getLabelStyle(cfg, labelCfg, group)
            labelStyle.fontSize = 12
            labelStyle.stroke = '#fff'
            labelStyle.lineWidth = 3
            const label = group.addShape('text', {
              attrs: labelStyle
            })
            return label
          }
        }, 'single-line')
      }
      regist('zmm', 'red')
      regist('zmm1', 'green')
      graph.refresh()
    },
    registerNodes () {
      G6.registerNode('本人', {
        draw (cfg, group) {
          const clip = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: 40,
              fill: '#F36924',
              lineWidth: 3,
              cursor: 'pointer'
            }
          })
          group.addShape('fan', {
            attrs: {
              x: 0,
              y: 0,
              rs: 40,
              re: 45,
              startAngle: 0,
              endAngle: 2 * Math.PI,
              fill: 'rgba(243,105,36,0.4)',
              cursor: 'pointer'
            }
          })
          if (cfg.label) { // 如果有文本
            // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
            // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            // style.text = cfg.label;
            group.addShape('text', {
              // attrs: style
              attrs: {
                x: 0, // 居中
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 14,
                text: cfg.label,
                fill: '#fff'
              }
            })
          }
          return clip
        }
      })
      G6.registerNode('重点', {
        draw (cfg, group) {
          const clip = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: 32,
              fill: '#F03F40',
              lineWidth: 3,
              cursor: 'pointer',
              opacity: cfg.style.opacity
            }
          })
          if (cfg.label) {
            group.addShape('text', {
              // attrs: style
              attrs: {
                x: 0, // 居中
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 14,
                text: cfg.label,
                fill: '#fff'
              }
            })
          }
          return clip
        }
      })
      G6.registerNode('test', {
        shapeType: 'circle',
        getShapeStyle (cfg) {
          var color = cfg.color || '#333'
          var style = {
            x: 0,
            y: 0,
            r: 32,
            fill: color,
            labelCfg: {
              fontSize: 20
            }
          }
          return style
        },
        drawLabel (cfg, group) {
          const labelCfg = cfg.labelCfg || {}
          const labelStyle = this.getLabelStyle(cfg, labelCfg, group)
          labelStyle.fill = 'green'
          labelStyle.fontSize = 20
          const label = group.addShape('text', {
            attrs: labelStyle
          })
          return label
        }
      }, 'single-shape')
      graph.refresh()
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
    },
    add1 () {

    }
  },
  mounted () {
    this.createGraph('container')
    this.init()
  },
  beforeDestroy () {
    // graph.destroy()
  }
}
</script>
