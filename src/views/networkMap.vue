<template>
  <div class="test3">
    <div id="container">
      <div class="btn">test</div>
    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
import { relation, relation2 } from '@/api/api.js'
const d3 = require('d3')
let graph = {}
export default {
  name: 'test3',
  data () {
    return {
      G6Data: {
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
          name: '亲属'
          // fill: 'rgba(56,122,238,1)'
        },
        {
          name: '重点'
          // fill: 'rgba(240,63,64,1)'
        },
        {
          name: '其他'
          // fill: 'rgba(35,179,215,1)'
        }
      ]
    }
  },
  computed: {
    rData: function () {
      if (this.G6Data) {
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
      } else {
        return {}
      }
    }
  },
  methods: {
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
            // 添加控制点
            if (controlPoints) {
              points = points.concat(controlPoints)
            } // 添加结束点
            let endArrow = {
              path: 'M 8,0 L -4,-4 L -4,4 Z', // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的
              d: startPoint.y > endPoint.y ? 4 : -4
            }
            points.push(endPoint)
            let path = this.getPath(points)
            let style = {
              stroke: cusEdge.fill,
              lineWidth: lineWidth,
              path: path,
              endArrow: endArrow,
              opacity: opacity
            }
            return style
          },
          drawLabel (cfg, group) {
            const labelCfg = cfg.labelCfg || {}
            let labelStyle = this.getLabelStyle(cfg, labelCfg, group)
            if (cusEdge.labelStyle) {
              labelStyle = cusEdge.labelStyle
            } else {
              labelStyle.fontSize = 12
              labelStyle.stroke = '#EBEEF3'
              labelStyle.fill = '#333'
              labelStyle.lineWidth = 5
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
            console.log(element)
            element.update({
              style: {
                opacity: 1,
                lineWidth: 2
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  fill: '#333333',
                  stroke: '#EBEEF3',
                  lineWidth: 5,
                  fontWeight: 400
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
                  fill: '#333333',
                  stroke: '#EBEEF3',
                  lineWidth: 5,
                  fontWeight: 400
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
    }
  },
  mounted () {
    relation({
      g_id: '100416',
      flag: 2
    }).then(res => {
      this.G6Data = res.data
      this.createGraph('container')
      this.init()
      this.$emit('my-event', graph)
    })
  }
}
</script>

<style lang="less">
.test3 {
  position: relative;
  #container {
    border: 1px green solid;
  }
  .btn {
    position: absolute;
    right: 20px;
    top: 20px;
    line-height: 30px;
    width: 60px;
    background: skyblue;
    border-radius: 4px;
    text-align: center;
  }
}
</style>
