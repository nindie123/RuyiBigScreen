<template>
  <BasePanel title="中心态势总览" subtitle="实时监控" :loading="loading" fullHeight>
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import BasePanel from '../components/BasePanel.vue'

defineProps<{
  loading?: boolean
}>()

// 模拟节点数据
const nodes = [
  { name: '数据中心', x: 50, y: 45, symbolSize: 28, category: 0 },
  { name: '华北节点', x: 30, y: 25, symbolSize: 18, category: 1 },
  { name: '华东节点', x: 70, y: 30, symbolSize: 18, category: 1 },
  { name: '华南节点', x: 65, y: 65, symbolSize: 18, category: 1 },
  { name: '西南节点', x: 30, y: 60, symbolSize: 18, category: 1 },
  { name: '边缘节点1', x: 20, y: 15, symbolSize: 10, category: 2 },
  { name: '边缘节点2', x: 80, y: 20, symbolSize: 10, category: 2 },
  { name: '边缘节点3', x: 75, y: 55, symbolSize: 10, category: 2 },
  { name: '边缘节点4', x: 40, y: 75, symbolSize: 10, category: 2 },
  { name: '边缘节点5', x: 15, y: 45, symbolSize: 10, category: 2 },
  { name: '边缘节点6', x: 85, y: 45, symbolSize: 10, category: 2 },
]

const chartOption = computed(() => ({
  tooltip: {
    backgroundColor: 'rgba(6, 30, 65, 0.9)',
    borderColor: 'rgba(64, 169, 255, 0.3)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
    formatter: (params: any) => {
      return `<strong>${params.name}</strong><br/>状态: 运行中<br/>延迟: ${Math.round(Math.random() * 50 + 10)}ms`
    },
  },
  xAxis: {
    show: false,
    min: 0,
    max: 100,
  },
  yAxis: {
    show: false,
    min: 0,
    max: 100,
  },
  series: [
    {
      type: 'graph',
      layout: 'none',
      coordinateSystem: 'cartesian2d',
      symbolSize: 12,
      roam: false,
      label: {
        show: true,
        position: 'bottom',
        color: 'rgba(232, 240, 254, 0.6)',
        fontSize: 10,
        distance: 5,
      },
      edgeSymbol: ['none', 'none'],
      edgeSymbolSize: [4, 10],
      lineStyle: {
        color: 'rgba(64, 169, 255, 0.25)',
        width: 1.5,
        curveness: 0.3,
        opacity: 0.6,
      },
      data: nodes.map((n) => ({
        name: n.name,
        x: n.x,
        y: n.y,
        symbolSize: n.symbolSize,
        category: n.category,
        itemStyle: {
          color: n.category === 0 ? '#40a9ff' : n.category === 1 ? '#36cfc9' : 'rgba(64, 169, 255, 0.4)',
          borderColor: n.category === 0 ? '#69c0ff' : 'transparent',
          borderWidth: n.category === 0 ? 2 : 0,
          shadowBlur: n.category === 0 ? 20 : 0,
          shadowColor: 'rgba(64, 169, 255, 0.4)',
        },
      })),
      edges: generateEdges(),
      categories: [
        { name: '核心', itemStyle: { color: '#40a9ff' } },
        { name: '区域', itemStyle: { color: '#36cfc9' } },
        { name: '边缘', itemStyle: { color: 'rgba(64, 169, 255, 0.4)' } },
      ],
      force: { repulsion: 100 },
      z: 2,
    },
    {
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: nodes.filter((n) => n.category < 2).map((n) => ({
        value: [n.x, n.y],
        symbolSize: n.symbolSize + 8,
        itemStyle: { color: 'transparent', borderColor: 'rgba(64, 169, 255, 0.15)', borderWidth: 1 },
      })),
      z: 1,
    },
  ],
}))

function generateEdges() {
  const edges: Array<{ source: number; target: number; lineStyle: { color: string; opacity: number } }> = []
  // 核心连接到所有区域节点
  for (let i = 1; i <= 4; i++) {
    edges.push({
      source: 0,
      target: i,
      lineStyle: { color: 'rgba(64, 169, 255, 0.4)', opacity: 0.8 },
    })
  }
  // 区域节点连接到相关边缘节点
  edges.push({ source: 1, target: 5, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  edges.push({ source: 2, target: 6, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  edges.push({ source: 3, target: 7, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  edges.push({ source: 3, target: 8, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  edges.push({ source: 1, target: 9, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  edges.push({ source: 2, target: 10, lineStyle: { color: 'rgba(54, 207, 201, 0.3)', opacity: 0.5 } })
  // 区域节点间互联
  edges.push({ source: 1, target: 2, lineStyle: { color: 'rgba(64, 169, 255, 0.15)', opacity: 0.3 } })
  edges.push({ source: 2, target: 3, lineStyle: { color: 'rgba(64, 169, 255, 0.15)', opacity: 0.3 } })
  edges.push({ source: 3, target: 4, lineStyle: { color: 'rgba(64, 169, 255, 0.15)', opacity: 0.3 } })
  edges.push({ source: 4, target: 1, lineStyle: { color: 'rgba(64, 169, 255, 0.15)', opacity: 0.3 } })
  return edges
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
