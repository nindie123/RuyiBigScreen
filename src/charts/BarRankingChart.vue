<template>
  <BasePanel title="城市排名" subtitle="按访问量" :loading="loading">
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
    backgroundColor: 'rgba(6, 30, 65, 0.9)',
    borderColor: 'rgba(64, 169, 255, 0.3)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
    formatter: (params: any) => {
      const item = params[0]
      return `${item.name}: ${item.value.toLocaleString()}`
    },
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    top: '5%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(64, 169, 255, 0.08)', type: 'dashed' } },
    axisLabel: {
      color: 'rgba(232, 240, 254, 0.45)',
      fontSize: 10,
      formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v),
    },
  },
  yAxis: {
    type: 'category',
    data: props.data.map((d) => d.name).reverse(),
    axisLine: { lineStyle: { color: 'rgba(64, 169, 255, 0.15)' } },
    axisLabel: { color: 'rgba(232, 240, 254, 0.65)', fontSize: 11 },
    axisTick: { show: false },
  },
  series: [
    {
      type: 'bar',
      data: props.data.map((d, i) => ({
        value: d.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 1, 0,
            [
              { offset: 0, color: getBarColor(i, props.data.length) },
              { offset: 1, color: getBarColorLight(i, props.data.length) },
            ]
          ),
          borderRadius: [0, 4, 4, 0],
        },
      })).reverse(),
      barWidth: '55%',
      label: {
        show: true,
        position: 'right',
        color: 'rgba(232, 240, 254, 0.5)',
        fontSize: 10,
        formatter: (params: any) => {
          const idx = props.data.length - 1 - params.dataIndex
          const item = props.data[idx]
          if (!item) return ''
          const arrow = item.change === 'up' ? '↑' : item.change === 'down' ? '↓' : '→'
          return `${arrow} ${item.value.toLocaleString()}`
        },
      },
    },
  ],
}))

function getBarColor(index: number, _total: number): string {
  const colors = ['#40a9ff', '#36cfc9', '#73d13d', '#ffc53d', '#ff7a45', '#597ef7', '#9254de', '#f759ab']
  return colors[index % colors.length]
}

function getBarColorLight(index: number, _total: number): string {
  const colors = ['#69c0ff', '#5cdbd3', '#95de64', '#ffd666', '#ff9c6e', '#85a5ff', '#b37feb', '#ff85c0']
  return colors[index % colors.length]
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 220px;
}
</style>
