<template>
  <BasePanel title="访问趋势" subtitle="近 14 日" :loading="loading">
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
    backgroundColor: 'rgba(6, 30, 65, 0.9)',
    borderColor: 'rgba(64, 169, 255, 0.3)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
  },
  legend: {
    data: ['本周期', '上周期'],
    textStyle: { color: 'rgba(232, 240, 254, 0.6)', fontSize: 11 },
    top: 0,
    right: 0,
    itemWidth: 14,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '18%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map((d) => d.date.slice(5)),
    axisLine: { lineStyle: { color: 'rgba(64, 169, 255, 0.15)' } },
    axisLabel: { color: 'rgba(232, 240, 254, 0.45)', fontSize: 10 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(64, 169, 255, 0.08)', type: 'dashed' } },
    axisLabel: {
      color: 'rgba(232, 240, 254, 0.45)',
      fontSize: 10,
      formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v),
    },
  },
  series: [
    {
      name: '上周期',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: props.data.map((d) => d.prevValue ?? null),
      lineStyle: { width: 1.5, color: 'rgba(114, 142, 185, 0.4)' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(114, 142, 185, 0.15)' },
            { offset: 1, color: 'rgba(114, 142, 185, 0)' },
          ],
        },
      },
    },
    {
      name: '本周期',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: props.data.map((d) => d.value),
      lineStyle: { width: 2.5, color: '#40a9ff' },
      itemStyle: { color: '#40a9ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 169, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 169, 255, 0)' },
          ],
        },
      },
      markPoint: {
        data: [
          {
            type: 'max',
            name: '最大值',
            symbol: 'pin',
            symbolSize: 40,
            label: { formatter: '{c}', fontSize: 10, color: '#e8f0fe' },
          },
        ],
      },
    },
  ],
}))
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 220px;
}
</style>
