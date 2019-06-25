<template>
  <div class="test3">
    <div id="container" style="background: #fff; border: 1px green solid">
    </div>
    <div style="margin-bottom: 100px;">
      <el-button type="primary" @click="add">addNodedges</el-button>

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
      }
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
    createGraph (container, width, height) {
      graph = new G6.Graph({
        container: container,
        width: width || 1000,
        height: height || 800,
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
            opacity: 0.5
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
            let size = cfg.size || 1
            cfg = this.getPathPoints(cfg)
            let startPoint = cfg.startPoint
            let endPoint = cfg.endPoint
            _this.lineDeviation(cfg)
            let controlPoints = this.getControlPoints(cfg)
            let points = [startPoint] // 添加起始点
            let opacity = cfg.style.opacity || 0.5
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
              stroke: color,
              lineWidth: size,
              path: path,
              endArrow: endArrow,
              opacity: opacity,
              labelCfg: {
                position: 'center', // 其实默认就是 center，这里写出来便于理解
                autoRotate: true,
                style: {
                  lineWidth: 5,
                  fill: '#333',
                  stroke: 'white' // 给文本添加白边和白色背景
                }
              }
            }
            return style
          }
        }, 'single-line')
      }
      regist('亲属', 'rgba(56,122,238,1)')
      regist('重点', 'rgba(240,63,64,1)')
      regist('其他', 'rgba(35,179,215,1)')
      graph.refresh()
    },
    registerNodes () {
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
          if (cfg.personId !== '') {
            openShape(group)
          }
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
      G6.registerNode('非重点', {
        draw (cfg, group) {
          const clip = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: 32,
              fill: '#387AEE',
              lineWidth: 3,
              cursor: 'pointer',
              opacity: cfg.style.opacity
            }
          })
          if (cfg.personId !== '') {
            openShape(group)
          }
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
      graph.refresh()
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
          _this.addEdge = e.item.get('edges')
          _this.addEdge.forEach(element => {
            element.update({
              style: {
                opacity: 1
              },
              labelCfg: {
                autoRotate: true,
                style: {
                  fill: '#333333',
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
    relation().then(res => {
      this.G6Data = res
      this.createGraph('container')
      this.init()
    })
  }
}
</script>
