<template>
  <BasePanel title="如意数据中枢" subtitle="HUB TOPOLOGY" :loading="loading" fullHeight>
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

const statusColors: Record<string, { main: string; glow: string; border: string }> = {
  good: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', border: '#fbbf24' },
  warning: { main: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)', border: '#fda4af' },
  danger: { main: '#f472b6', glow: 'rgba(244, 114, 182, 0.4)', border: '#f9a8d4' },
}

const chartOption = computed(() => {
  const nodes = props.data
  const centerNode = nodes.find((n) => n.id === 'center')
  const bizNodes = nodes.filter((n) => n.id !== 'center')

  return {
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
      borderWidth: 1,
      textStyle: { color: '#fefce8', fontSize: 11 },
      formatter: (params: any) => {
        if (params.seriesType === 'graph' && params.dataType === 'node') {
          const node = nodes.find((n) => n.name === params.name)
          if (!node) return `<strong>${params.name}</strong>`
          const sl = node.status === 'good' ? '● 正常' : node.status === 'warning' ? '● 注意' : '● 告警'
          return `<strong style="font-size:13px;">${node.name}</strong><br/>
                  <span style="color:rgba(254,252,232,0.5);">活跃度:</span> ${node.value}/100<br/>
                  <span style="color:rgba(254,252,232,0.5);">状态:</span> ${sl}<br/>
                  <span style="color:rgba(254,252,232,0.35);font-size:10px;">${node.description}</span>`
        }
        return ''
      },
    },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    graphic: {
      elements: [
        ...generateRingElements(centerNode?.coord ?? [50, 50]),
        { type: 'line', shape: { x1: 0, y1: 50, x2: 100, y2: 50 }, style: { stroke: 'rgba(245, 158, 11, 0.03)', lineWidth: 0.5 }, z: 0 },
        { type: 'line', shape: { x1: 50, y1: 0, x2: 50, y2: 100 }, style: { stroke: 'rgba(245, 158, 11, 0.03)', lineWidth: 0.5 }, z: 0 },
      ],
    },
    series: [
      {
        type: 'scatter', coordinateSystem: 'cartesian2d',
        data: [{ value: [50, 50], symbolSize: 85 }, { value: [50, 50], symbolSize: 60 }, { value: [50, 50], symbolSize: 40 }],
        symbol: 'circle',
        itemStyle: { color: 'rgba(245, 158, 11, 0.03)', borderColor: 'rgba(245, 158, 11, 0.06)', borderWidth: 1 },
        label: { show: false }, emphasis: { scale: false }, z: 1,
      },
      ...generateFlowLines(centerNode!, bizNodes),
      {
        type: 'graph', layout: 'none', coordinateSystem: 'cartesian2d',
        roam: false, draggable: false, symbolSize: 12, edgeSymbol: ['none', 'none'],
        label: { show: true, position: 'bottom', color: 'rgba(254, 252, 232, 0.6)', fontSize: 10, distance: 5 },
        lineStyle: { color: 'rgba(245, 158, 11, 0.1)', width: 1.5, curveness: 0.25, opacity: 0.5 },
        data: nodes.map((n) => {
          const isCenter = n.id === 'center'
          const sc = statusColors[n.status] || statusColors.good
          return {
            name: n.name, x: n.coord[0], y: n.coord[1],
            symbolSize: isCenter ? 32 : Math.max(13, (n.value / 100) * 20),
            category: isCenter ? 0 : 1,
            itemStyle: {
              color: isCenter ? { type: 'radial', x: 0.5, y: 0.5, r: 0.5, colorStops: [{ offset: 0, color: '#fbbf24' }, { offset: 1, color: '#f59e0b' }] } : sc.main,
              borderColor: isCenter ? '#fde68a' : sc.border,
              borderWidth: isCenter ? 3 : 2,
              shadowBlur: isCenter ? 25 : 10,
              shadowColor: isCenter ? 'rgba(245, 158, 11, 0.5)' : sc.glow,
            },
          }
        }),
        edges: generateTopologyEdges(nodes),
        categories: [
          { name: '中枢', itemStyle: { color: '#f59e0b', borderColor: '#fbbf24', borderWidth: 3 }, label: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' as const } },
          { name: '业务节点', itemStyle: { color: '#2dd4bf' }, label: { color: 'rgba(254, 252, 232, 0.6)', fontSize: 10 } },
        ],
        focusNodeAdjacency: 'all', z: 3,
      },
      { type: 'effectScatter', coordinateSystem: 'cartesian2d', data: [{ value: [50, 50] }], symbol: 'circle', symbolSize: 46,
        rippleEffect: { brushType: 'stroke', scale: 4, period: 3, color: 'rgba(245, 158, 11, 0.18)' },
        itemStyle: { color: 'transparent' }, label: { show: false }, z: 0 },
      { type: 'effectScatter', coordinateSystem: 'cartesian2d', data: [{ value: [50, 50] }], symbol: 'circle', symbolSize: 36,
        rippleEffect: { brushType: 'stroke', scale: 5.5, period: 4.5, color: 'rgba(251, 191, 36, 0.1)' },
        itemStyle: { color: 'transparent' }, label: { show: false }, z: 0 },
    ],
  }
})

function generateRingElements(_center: [number, number]) {
  return [
    { r: '16%', opacity: 0.04, width: 0.5 },
    { r: '25%', opacity: 0.03, width: 0.5 },
    { r: '35%', opacity: 0.02, width: 0.3 },
  ].map((ring) => ({
    type: 'circle', shape: { cx: '50%', cy: '50%', r: ring.r },
    style: { stroke: `rgba(245, 158, 11, ${ring.opacity})`, fill: 'none', lineWidth: ring.width }, z: 0,
  }))
}

function generateTopologyEdges(nodes: HubNode[]) {
  const edges: any[] = []
  const ci = nodes.findIndex((n) => n.id === 'center')
  nodes.forEach((n, i) => {
    if (i !== ci) edges.push({ source: ci, target: i, lineStyle: { color: n.status === 'good' ? 'rgba(245, 158, 11, 0.25)' : n.status === 'warning' ? 'rgba(251, 113, 133, 0.2)' : 'rgba(244, 114, 182, 0.2)', opacity: 0.6, width: 1.2, curveness: 0.15 } })
  })
  const bi = nodes.map((_, i) => i).filter((i) => i !== ci)
  for (let i = 0; i < bi.length; i++) {
    const j = (i + 1) % bi.length
    edges.push({ source: bi[i], target: bi[j], lineStyle: { color: 'rgba(245, 158, 11, 0.05)', opacity: 0.3, width: 0.8, curveness: 0.2 } })
    const k = (i + 4) % bi.length
    if (k !== j && k !== i) edges.push({ source: bi[i], target: bi[k], lineStyle: { color: 'rgba(245, 158, 11, 0.025)', opacity: 0.15, width: 0.5, curveness: 0.3 } })
  }
  return edges
}

function generateFlowLines(centerNode: HubNode, bizNodes: HubNode[]) {
  const c = centerNode?.coord ?? [50, 50]
  return bizNodes.map((node) => {
    const sc = statusColors[node.status] || statusColors.good
    return { type: 'lines', coordinateSystem: 'cartesian2d', data: [{ coords: [c, node.coord] }], lineStyle: { color: sc.main, width: 1.5, curveness: 0.2, opacity: 0.2 }, effect: { show: true, period: 3 + Math.random() * 3, trailLength: 0.3, symbol: 'arrow', symbolSize: [5, 5], color: sc.main }, z: 2, animation: true }
  })
}
</script>

<style scoped lang="scss">
.chart { width: 100%; height: 100%; min-height: 280px; }
</style>
