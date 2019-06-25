<template>
  <div class="test1">
    <div id="container" style="background: rgb(230, 230, 230); width: 800px">
      <el-button type="primary" @click="changeNode1">click</el-button>

    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
// let Util = require('@antv/util')
let graph = {}
export default {
  name: 'test1',
  data () {
    return {
      g6Data: {
        nodes: [{
          id: 'master',
          x: 200,
          y: 275,
          shape: 'masterPicture',
          label: '李彦宏',
          style: {
            lineWidth: 3
          }
        }, {
          id: 'rela2',
          x: 400,
          y: 200,
          label: '百度云\n计算技术（\n北京）...',
          size: 80,
          anchorPoints: [
          ]
        },
        {
          id: 'rela3',
          x: 400,
          y: 350,
          label: '百度云\n计算技术（\n北京）...',
          anchorPoints: [
          ]
        }
        ],
        edges: [
          {
            id: 'edge2',
            target: 'rela2',
            source: 'master',
            // shape: 'cusLine',
            shape: 'redLine',
            label: '同案犯',
            labelCfg: {
              position: 'start',
              autoRotate: true,
              refX: 0,
              refY: 0
            },
            style: {
              endArrow: true
            }
          },
          {
            id: 'edge4',
            target: 'rela2',
            source: 'master',
            // shape: 'cusLine',
            label: '家人',
            shape: 'greenline'
          },
          {
            id: 'edge3',
            target: 'rela3',
            source: 'master',
            // shape: 'cusLine',
            // shape: 'hvh',
            style: {
              endArrow: 'custom-arrow'
            }
          },
          {
            id: 'edge5',
            target: 'rela3',
            source: 'master',
            // shape: 'cusLine',
            // shape: 'hvh',
            style: {
              endArrow: 'custom-arrow'
            }
          },
          {
            id: 'edge6',
            target: 'rela2',
            source: 'master',
            // shape: 'cusLine',
            label: '匿名关系',
            shape: 'redLine'
          },
          {
            id: 'edge7',
            target: 'rela3',
            source: 'rela2',
            // shape: 'cusLine',
            label: '未知关系',
            shape: 'greenline'
          },
          {
            id: 'edge8',
            target: 'rela2',
            source: 'master',
            // shape: 'cusLine',
            label: '很多字的关系',
            shape: 'greenline'
          }
          // {
          //   id: 'edge9',
          //   target: 'rela2',
          //   source: 'master',
          //   // shape: 'cusLine',
          //   label: '小小小',
          //   shape: 'greenline'
          // }
        ]
      },
      layoutMap: {
        1: 0,
        2: Math.PI / 9,
        3: -Math.PI / 9,
        4: Math.PI / 4,
        5: -Math.PI / 4
      },
      layoutMap2: {
        1: Math.PI / 14,
        2: -Math.PI / 14,
        3: Math.PI / 4,
        4: -Math.PI / 4
      }
    }
  },
  methods: {
    createGraph (container, width, height) {
      graph = new G6.Graph({
        container: container,
        width: width || 500,
        height: height || 500,
        modes: { // 支持的 behavior
          default: ['drag-node', 'click-select', 'drag-canvas', 'zoom-canvas']
        },
        defaultNode: {
          size: 55,
          labelCfg: {
            position: 'center', // 其实默认就是 center，这里写出来便于理解
            autoRotate: true,
            style: {
              fill: '#fff',
              fontSize: 10
            }
          }
        },
        nodeStyle: {
          // 节点在默认状态下的样式
          default: {
            fill: '#40a9ff',
            stroke: '#40a9ff'
          }
        },
        defaultEdge: {
          size: 2,
          labelCfg: {
            position: 'center', // 其实默认就是 center，这里写出来便于理解
            autoRotate: true,
            style: {
              fill: '#fff',
              fontSize: 10
            }
          }
        }
      //
      })
    },
    init () {
      graph.data(this.g6Data)
      graph.render()
      this.changeNode()
      this.changeEdge()
    },
    changeNode () {
      G6.registerNode('masterPicture', {
        draw (cfg, group) {
          const clip = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: 40,
              // stroke: '#F36924',
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
              // stroke: 'rgba(243,105,36,0.4)',
              fill: 'rgba(243,105,36,0.4)',
              cursor: 'pointer'
              // opacity: 0.6
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
      graph.refresh()
    },
    lineDeviation (cfg) {
      let angle = 0
      if (cfg.lineCount % 2 === 0) {
        let index = cfg.sameLineIndex % 4 === 0 ? 4 : cfg.sameLineIndex % 4
        angle = this.layoutMap2[index]
      } else {
        let index = cfg.sameLineIndex % 5 === 0 ? 5 : cfg.sameLineIndex % 5
        angle = this.layoutMap[index]
      }
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
    changeEdge () {
      let _this = this
      G6.registerEdge('hvh', {
        draw (cfg, group) {
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          cfg.startPoint.y = cfg.startPoint.y - 10
          const shape = group.addShape('path', {
            attrs: {
              stroke: '#333',
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
                ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
                ['L', endPoint.x, endPoint.y]
              ]
            }
          })
          return shape
        }
      })
      G6.registerEdge('redLine', {
        draw (cfg, group) {
          _this.lineDeviation(cfg)
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          const startY = cfg.sourceNode._cfg.model.y
          const endY = cfg.targetNode._cfg.model.y
          const shape = group.addShape('path', {
            attrs: {
              stroke: 'red',
              endArrow: {
                path: 'M 8,0 L -5,-5 L -5,5 Z', // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的
                d: endY > startY ? 5 : -5
              },
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y]
              ]
            }
          })

          return shape
        }
      })
      G6.registerEdge('greenline', {
        draw (cfg, group) {
          _this.lineDeviation(cfg)
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          const startY = cfg.sourceNode._cfg.model.y
          const endY = cfg.targetNode._cfg.model.y
          const shape = group.addShape('path', {
            attrs: {
              stroke: 'green',
              endArrow: {
                path: 'M 8,0 L -5,-5 L -5,5 Z', // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的
                d: endY > startY ? 5 : -5
              },
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y]
              ]
            }
          })
          group.addShape('text', {
            // attrs: style
            attrs: {
              x: (startPoint.x + endPoint.x) / 2,
              y: (startPoint.y + endPoint.y) / 2,
              fontFamily: 'PingFang SC',
              textAlign: 'center',
              textBaseline: 'middle',
              fontSize: 14,
              text: cfg.label,
              autoRotate: true,
              labeCfg: {
                autoRotate: true
              },
              fill: '#333333',
              stroke: '#FFFFFF',
              lineWidth: 4
            }
          })
          return shape
        }
      })

      graph.refresh()
    },
    changeNode1 () {
      let a = graph.findById('edge2')
      a._cfg.currentShape = 'line'

      graph.update('edge2', {
        label: 'feewfwef',
        labelCfg: {
          position: 'center', // 其实默认就是 center，这里写出来便于理解
          autoRotate: true,
          style: {
            lineWidth: 5,
            fill: '#722ed1',
            stroke: 'white' // 给文本添加白边和白色背景
          }
        }
      })
      console.log(a._cfg)
    },
    // 数据预处理
    dataPretreatment () {
      let edgeArr = this.g6Data.edges
      let controlNum, arrIndex
      for (let i = 0; i < edgeArr.length; i++) {
        controlNum = 1
        arrIndex = []
        if (!edgeArr[i].sameLineIndex) {
          edgeArr[i]['sameLineIndex'] = controlNum
          arrIndex.push(i)
          controlNum++
          for (let j = i + 1; j < edgeArr.length; j++) {
            if (!edgeArr[j].sameLineIndex && edgeArr[i].source === edgeArr[j].source && edgeArr[i].target === edgeArr[j].target) {
              edgeArr[j]['sameLineIndex'] = controlNum
              arrIndex.push(j)
              controlNum++
            }
          }
          arrIndex.forEach(ele => {
            edgeArr[ele].lineCount = controlNum - 1
          })
        }
      }
      console.log(edgeArr)
    }
  },
  mounted () {
    this.dataPretreatment()
    this.createGraph('container', '800', '550')
    this.init()
  }
}
</script>
