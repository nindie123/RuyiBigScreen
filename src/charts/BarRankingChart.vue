<template>
  <BasePanel title="城市排名" subtitle="RANKING" :loading="loading">
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import BasePanel from '../components/BasePanel.vue'
import type { RankingItem } from '../types/dashboard'

const props = defineProps<{
  data: RankingItem[]
  loading?: boolean
}>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    textStyle: { color: '#fefce8', fontSize: 11 },
    formatter: (params: any) => `${params[0].name}: ${params[0].value.toLocaleString()}`,
  },
  grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.04)', type: 'dashed' } },
    axisLabel: { color: 'rgba(254, 252, 232, 0.3)', fontSize: 9, formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v) },
  },
  yAxis: {
    type: 'category',
    data: props.data.map((d) => d.name).reverse(),
    axisLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.08)' } },
    axisLabel: { color: 'rgba(254, 252, 232, 0.45)', fontSize: 10 },
    axisTick: { show: false },
  },
  series: [{
    type: 'bar',
    data: props.data.map((d, i) => ({
      value: d.value,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: getBarColor(i) },
          { offset: 1, color: getBarColorLight(i) },
        ]),
        borderRadius: [0, 3, 3, 0],
      },
    })).reverse(),
    barWidth: '40%',
    label: {
      show: true, position: 'right',
      color: 'rgba(254, 252, 232, 0.3)', fontSize: 9,
      formatter: (params: any) => {
        const idx = props.data.length - 1 - params.dataIndex
        const item = props.data[idx]
        if (!item) return ''
        const arrow = item.change === 'up' ? '↑' : item.change === 'down' ? '↓' : '→'
        return `${arrow} ${item.value.toLocaleString()}`
      },
    },
  }],
}))

function getBarColor(index: number): string {
  const colors = ['#f59e0b', '#fb7185', '#fbbf24', '#2dd4bf', '#a78bfa', '#f472b6', '#34d399', '#f97316']
  return colors[index % colors.length]
}
function getBarColorLight(index: number): string {
  const colors = ['#fbbf24', '#fda4af', '#fde68a', '#5eead4', '#c4b5fd', '#f9a8d4', '#6ee7b7', '#fdba74']
  return colors[index % colors.length]
}
</script>

<style scoped lang="scss">
.chart { width: 100%; height: 100%; min-height: 180px; }
</style>
