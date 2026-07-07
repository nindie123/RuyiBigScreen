<template>
  <BasePanel title="如意数据中枢" subtitle="业务节点拓扑" :loading="loading" fullHeight>
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import BasePanel from '../components/BasePanel.vue'
import type { HubNode } from '../types/dashboard'

const props = defineProps<{
  data: HubNode[]
  loading?: boolean
}>()

/** 状态颜色映射 */
const statusColors: Record<string, { main: string; glow: string; border: string }> = {
  good: { main: '#36cfc9', glow: 'rgba(54, 207, 201, 0.4)', border: '#5cdbd3' },
  warning: { main: '#d4a017', glow: 'rgba(212, 160, 23, 0.4)', border: '#e8b830' },
  danger: { main: '#ff6b6b', glow: 'rgba(255, 107, 107, 0.4)', border: '#ff8a8a' },
}

const chartOption = computed(() => {
  const nodes = props.data
  const centerNode = nodes.find((n) => n.id === 'center')
  const bizNodes = nodes.filter((n) => n.id !== 'center')

  return {
    tooltip: {
      backgroundColor: 'rgba(4, 18, 40, 0.92)',
      borderColor: 'rgba(54, 207, 201, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#e8f0fe', fontSize: 12 },
      formatter: (params: any) => {
        if (params.seriesType === 'graph' && params.dataType === 'node') {
          const node = nodes.find((n) => n.name === params.name)
          if (!node) return `<strong>${params.name}</strong>`
          const statusLabel =
            node.status === 'good' ? '🟢 正常' : node.status === 'warning' ? '🟡 注意' : '🔴 告警'
          return `<strong style="font-size:14px;">${node.name}</strong><br/>
                  <span style="color:rgba(232,240,254,0.6);">活跃度:</span> ${node.value}/100<br/>
                  <span style="color:rgba(232,240,254,0.6);">状态:</span> ${statusLabel}<br/>
                  <span style="color:rgba(232,240,254,0.5);font-size:11px;">${node.description}</span>`
        }
        return ''
      },
    },

    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },

    // 国风装饰图形
    graphic: {
      elements: [
        // 外圈星轨环
        ...generateRingElements(centerNode?.coord ?? [50, 50]),
        // 底部淡山峦
        {
          type: 'path',
          shape: {
            pathData:
              'M0,85 Q10,78 20,82 Q30,74 40,80 Q50,72 60,78 Q70,70 80,76 Q90,68 100,74 L100,100 L0,100 Z',
          },
          style: { fill: 'rgba(54, 207, 201, 0.04)', stroke: 'rgba(54, 207, 201, 0.06)', lineWidth: 0.5 },
          z: 0,
        },
        // 中层山峦
        {
          type: 'path',
          shape: {
            pathData:
              'M0,90 Q15,84 30,88 Q45,80 60,86 Q75,78 90,84 Q95,80 100,84 L100,100 L0,100 Z',
          },
          style: { fill: 'rgba(54, 207, 201, 0.025)', stroke: 'rgba(54, 207, 201, 0.04)', lineWidth: 0.5 },
          z: 0,
        },
        // 云纹线-左
        {
          type: 'path',
          shape: {
            pathData:
              'M5,15 C10,12 15,18 20,15 C25,12 30,18 35,15',
          },
          style: { stroke: 'rgba(54, 207, 201, 0.06)', fill: 'none', lineWidth: 0.8 },
          z: 0,
        },
        // 云纹线-右
        {
          type: 'path',
          shape: {
            pathData:
              'M65,12 C70,9 75,15 80,12 C85,9 90,15 95,12',
          },
          style: { stroke: 'rgba(54, 207, 201, 0.06)', fill: 'none', lineWidth: 0.8 },
          z: 0,
        },
      ],
    },

    series: [
      // 背景光晕 - 中心节点大光圈
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: [
          { value: [50, 50], symbolSize: 90 },
          { value: [50, 50], symbolSize: 65 },
          { value: [50, 50], symbolSize: 42 },
        ],
        symbol: 'circle',
        itemStyle: {
          color: 'rgba(54, 207, 201, 0.04)',
          borderColor: 'rgba(54, 207, 201, 0.08)',
          borderWidth: 1,
        },
        label: { show: false },
        emphasis: { scale: false },
        z: 1,
      },

      // 数据流边线 - lines 支持流光效果
      ...generateFlowLines(centerNode!, bizNodes),

      // 主拓扑图 - 节点 + 连接
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        roam: false,
        draggable: false,
        symbolSize: 12,
        edgeSymbol: ['none', 'none'],
        label: {
          show: true,
          position: 'bottom',
          color: 'rgba(232, 240, 254, 0.7)',
          fontSize: 11,
          distance: 6,
          fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
        },
        lineStyle: {
          color: 'rgba(54, 207, 201, 0.15)',
          width: 1.5,
          curveness: 0.25,
          opacity: 0.5,
        },
        data: nodes.map((n) => {
          const isCenter = n.id === 'center'
          const sc = statusColors[n.status] || statusColors.good
          return {
            name: n.name,
            x: n.coord[0],
            y: n.coord[1],
            symbolSize: isCenter ? 34 : Math.max(14, (n.value / 100) * 22),
            category: isCenter ? 0 : 1,
            itemStyle: {
              color: isCenter ? { type: 'radial', x: 0.5, y: 0.5, r: 0.5, colorStops: [{ offset: 0, color: '#5cdbd3' }, { offset: 1, color: '#0097a7' }] } : sc.main,
              borderColor: isCenter ? '#80deea' : sc.border,
              borderWidth: isCenter ? 3 : 2,
              shadowBlur: isCenter ? 30 : 12,
              shadowColor: isCenter ? 'rgba(54, 207, 201, 0.6)' : sc.glow,
            },
          }
        }),
        edges: generateTopologyEdges(nodes),
        categories: [
          {
            name: '中枢',
            itemStyle: { color: '#36cfc9', borderColor: '#80deea', borderWidth: 3 },
            label: { color: '#36cfc9', fontSize: 12, fontWeight: 'bold' as const },
          },
          {
            name: '业务节点',
            itemStyle: { color: '#4fc3f7' },
            label: { color: 'rgba(232, 240, 254, 0.7)', fontSize: 11 },
          },
        ],
        focusNodeAdjacency: 'all',
        z: 3,
      },

      // 中心脉冲效果
      {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: [{ value: [50, 50] }],
        symbol: 'circle',
        symbolSize: 50,
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 3,
          color: 'rgba(54, 207, 201, 0.25)',
        },
        itemStyle: { color: 'transparent' },
        label: { show: false },
        z: 0,
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: [{ value: [50, 50] }],
        symbol: 'circle',
        symbolSize: 38,
        rippleEffect: {
          brushType: 'stroke',
          scale: 5.5,
          period: 4.5,
          color: 'rgba(54, 207, 201, 0.12)',
        },
        itemStyle: { color: 'transparent' },
        label: { show: false },
        z: 0,
      },
    ],
  }
})

/** 生成装饰性同心圆环 */
function generateRingElements(_center: [number, number]): Array<{
  type: string
  shape: { cx: string; cy: string; r: string }
  style: { stroke: string; fill: string; lineWidth: number }
  z: number
}> {
  const rings = [
    { r: '18%', opacity: 0.06, width: 0.5 },
    { r: '28%', opacity: 0.04, width: 0.5 },
    { r: '38%', opacity: 0.03, width: 0.3 },
  ]
  return rings.map((ring) => ({
    type: 'circle',
    shape: { cx: '50%', cy: '50%', r: ring.r },
    style: { stroke: `rgba(54, 207, 201, ${ring.opacity})`, fill: 'none', lineWidth: ring.width },
    z: 0,
  }))
}

/** 生成拓扑连接边 */
function generateTopologyEdges(nodes: HubNode[]) {
  const edges: Array<{ source: number; target: number; lineStyle: { color: string; opacity: number; width: number; curveness: number } }> = []
  const centerIdx = nodes.findIndex((n) => n.id === 'center')

  // 中心到所有业务节点
  nodes.forEach((n, i) => {
    if (i !== centerIdx) {
      edges.push({
        source: centerIdx,
        target: i,
        lineStyle: {
          color: n.status === 'good' ? 'rgba(54, 207, 201, 0.35)' : n.status === 'warning' ? 'rgba(212, 160, 23, 0.3)' : 'rgba(255, 107, 107, 0.3)',
          opacity: 0.6,
          width: 1.2,
          curveness: 0.15,
        },
      })
    }
  })

  // 相邻业务节点互联（形成环形）
  const bizIndices = nodes.map((_, i) => i).filter((i) => i !== centerIdx)
  for (let i = 0; i < bizIndices.length; i++) {
    const j = (i + 1) % bizIndices.length
    edges.push({
      source: bizIndices[i],
      target: bizIndices[j],
      lineStyle: {
        color: 'rgba(54, 207, 201, 0.08)',
        opacity: 0.3,
        width: 0.8,
        curveness: 0.2,
      },
    })
    // 对角的节点也连接
    const k = (i + 4) % bizIndices.length
    if (k !== j && k !== i) {
      edges.push({
        source: bizIndices[i],
        target: bizIndices[k],
        lineStyle: {
          color: 'rgba(54, 207, 201, 0.04)',
          opacity: 0.15,
          width: 0.5,
          curveness: 0.3,
        },
      })
    }
  }

  return edges
}

/** 生成流光数据线 */
function generateFlowLines(centerNode: HubNode, bizNodes: HubNode[]) {
  const center = centerNode?.coord ?? [50, 50]

  return bizNodes.map((node) => {
    const sc = statusColors[node.status] || statusColors.good
    return {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      data: [{ coords: [center, node.coord] }],
      lineStyle: {
        color: sc.main,
        width: 1.5,
        curveness: 0.2,
        opacity: 0.25,
      },
      effect: {
        show: true,
        period: 3 + Math.random() * 3,
        trailLength: 0.3,
        symbol: 'arrow',
        symbolSize: [5, 5],
        color: sc.main,
      },
      z: 2,
      animation: true,
    }
  })
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 320px;
}
</style>
