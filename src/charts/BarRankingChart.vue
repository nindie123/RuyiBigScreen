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
    backgroundColor: 'rgba(4, 18, 40, 0.92)',
    borderColor: 'rgba(54, 207, 201, 0.25)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
    formatter: (params: any) => {
      const item = params[0]
      return `${item.name}: ${item.value.toLocaleString()}`
    },
  },
  grid: {
    left: '3%',
    right: '10%',
    bottom: '3%',
    top: '5%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(54, 207, 201, 0.06)', type: 'dashed' } },
    axisLabel: {
      color: 'rgba(232, 240, 254, 0.35)',
      fontSize: 10,
      formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v),
    },
  },
  yAxis: {
    type: 'category',
    data: props.data.map((d) => d.name).reverse(),
    axisLine: { lineStyle: { color: 'rgba(54, 207, 201, 0.12)' } },
    axisLabel: { color: 'rgba(232, 240, 254, 0.55)', fontSize: 11 },
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
              { offset: 0, color: getBarColor(i) },
              { offset: 1, color: getBarColorLight(i) },
            ]
          ),
          borderRadius: [0, 4, 4, 0],
        },
      })).reverse(),
      barWidth: '50%',
      label: {
        show: true,
        position: 'right',
        color: 'rgba(232, 240, 254, 0.4)',
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

function getBarColor(index: number): string {
  const colors = ['#36cfc9', '#4fc3f7', '#5cdbd3', '#3db8c0', '#80deea', '#26a69a', '#4dd0e1', '#b2ebf2']
  return colors[index % colors.length]
}

function getBarColorLight(index: number): string {
  const colors = ['#5cdbd3', '#81d4fa', '#80deea', '#4db6ac', '#a5d8e8', '#80cbc4', '#80deea', '#d4f1f9']
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
