<template>
  <BasePanel title="访问趋势" subtitle="REALTIME" :loading="loading">
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import BasePanel from '../components/BasePanel.vue'
import type { TrendDataPoint } from '../types/dashboard'

const props = defineProps<{
  data: TrendDataPoint[]
  loading?: boolean
}>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    textStyle: { color: '#fefce8', fontSize: 11 },
  },
  legend: {
    data: ['本周期', '上周期'],
    textStyle: { color: 'rgba(254, 252, 232, 0.4)', fontSize: 10 },
    top: 0, right: 0,
    itemWidth: 12, itemHeight: 8,
  },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '16%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map((d) => d.date),
    axisLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.08)' } },
    axisLabel: { color: 'rgba(254, 252, 232, 0.3)', fontSize: 9, formatter: (v: string) => v.length > 5 ? v.slice(5) : v },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.04)', type: 'dashed' } },
    axisLabel: { color: 'rgba(254, 252, 232, 0.3)', fontSize: 9, formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v) },
  },
  series: [
    {
      name: '上周期',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: props.data.map((d) => d.prevValue ?? null),
      lineStyle: { width: 1.5, color: 'rgba(251, 191, 36, 0.2)' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(251, 191, 36, 0.08)' }, { offset: 1, color: 'rgba(251, 191, 36, 0)' }] } },
    },
    {
      name: '本周期',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 3,
      data: props.data.map((d) => d.value),
      lineStyle: { width: 2, color: '#f59e0b' },
      itemStyle: { color: '#fbbf24' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(245, 158, 11, 0.18)' }, { offset: 1, color: 'rgba(245, 158, 11, 0)' }] } },
      markPoint: { data: [{ type: 'max', name: '最大值', symbol: 'pin', symbolSize: 30, label: { formatter: '{c}', fontSize: 9, color: '#fefce8' }, itemStyle: { color: '#f59e0b' } }] },
    },
  ],
}))
</script>

<style scoped lang="scss">
.chart { width: 100%; height: 100%; min-height: 180px; }
</style>
