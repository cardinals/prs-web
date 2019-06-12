<template>
  <div class="test1">
    <div id="container" style="background: rgb(230, 230, 230); width: 800px">
      <el-button type="primary" @click="changeNode">click</el-button>

    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
import { getResultList } from '../api/api.js'
// let Util = require('@antv/util')
let cusImg = require('../assets/images/searchList1/pic_head_1.png')
let cusImg1 = require('../assets/images/searchList1/icon_man_default.png')
let cusImg2 = require('../assets/images/searchList1/icon_woman_default.png')
let cusImg3 = require('../assets/images/searchList1/pic_head_3.png')
let cusImg4 = require('../assets/images/searchList1/pic_head_2.png')
let graph = {}
export default {
  name: 'test1',
  data () {
    return {
      g6Data: {
        nodes: [{
          id: 'master',
          x: 400,
          y: 275,
          shape: 'masterPicture',
          label: '李彦宏',
          style: {
            lineWidth: 3
          }
        }, {
          id: 'rela1',
          x: 200,
          y: 100,
          label: '北京虚\n拟投资管理\n有限公...'

        }, {
          id: 'rela2',
          x: 200,
          y: 300,
          label: '百度云\n计算技术（\n北京）...'
        }
        ],
        edges: [
          {
            id: 'edge1',
            target: 'rela1',
            source: 'master',
            shape: 'cusLine'
          },
          {
            id: 'edge1',
            target: 'rela2',
            source: 'master',
            shape: 'cusLine'
          }
        ]
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
          default: ['drag-node', 'click-select', 'drag-canvas']
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
          size: 2
        },
        edgeStyle: {
          // 默认边的样式
          default: {
            stroke: '#2770EE',
            endArrow: 'cusArrow'
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
              r: 30,
              stroke: '#F07272',
              fill: '#fff',
              lineWidth: 3,
              cursor: 'pointer'

            }
          })
          group.addShape('image', {
            attrs: {
              x: -40,
              y: -38,
              width: 80,
              height: 80,
              img: cusImg,
              clip: clip,
              cursor: 'pointer'
            }
          })
          group.addShape('fan', {
            attrs: {
              x: 0,
              y: 0,
              rs: 31.5,
              re: 37,
              startAngle: 0,
              endAngle: 2 * Math.PI,
              stroke: 'rgba(255,169,83,0.5)',
              fill: 'rgba(255,169,83,0.5)',
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
                y: 16,
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 12,
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
    changeEdge () {
      G6.registerEdge('cusLine', {
        draw (cfg, group) {
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          const shape = group.addShape('path', {
            attrs: {
              stroke: 'red',
              lineWidth: 2,
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y]
              ]
            }
          })
          group.addShape('path', {
            attrs: {
              endArrow: {
                // path 的 width, height, radius 是基于线宽来计算的，详情可见源码。
                path: [
                  [ 'M', -5, 5 ],
                  [ 'L', 5, 0],
                  [ 'L', -5, -5 ],
                  [ 'A', 5, 5, 0, 0, 1, -5, 5 ],
                  [ 'Z' ]
                ],
                d: 5
              },
              attrs: {
                stroke: 'red',
                lineWidth: 2
              }
            }
          })
          return shape
        }
      })
      graph.refresh()
    }
  },
  mounted () {
    let params = {
      'query': '王',
      'xingbie': '01000000',
      'juzhudi': '31',
      'hujidizhi': '31',
      'age': '30-40',
      'label': [
        '汉族'
      ],
      'order': 'desc',
      'pagenumber': 2,
      'pagecapacity': 5
    }
    this.createGraph('container', '800', '550')
    this.init()
    getResultList(params).then(res => {
    })
  }
}
</script>
