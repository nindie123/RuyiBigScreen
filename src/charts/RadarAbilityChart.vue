<template>
  <BasePanel title="能力雷达" subtitle="CAPABILITY" :loading="loading">
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import BasePanel from '../components/BasePanel.vue'
import type { RadarDimension } from '../types/dashboard'

const props = defineProps<{
  data: RadarDimension[]
  loading?: boolean
}>()

const chartOption = computed(() => ({
  tooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    textStyle: { color: '#fefce8', fontSize: 11 },
  },
  radar: {
    indicator: props.data.map((d) => ({ name: d.name, max: d.max })),
    shape: 'circle',
    splitNumber: 4,
    radius: '62%',
    axisName: { color: 'rgba(254, 252, 232, 0.45)', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.06)' } },
    splitArea: { areaStyle: { color: ['rgba(245, 158, 11, 0.015)', 'rgba(251, 191, 36, 0.03)'] } },
    axisLine: { lineStyle: { color: 'rgba(245, 158, 11, 0.08)' } },
  },
  series: [{
    type: 'radar',
    data: [{
      value: props.data.map((d) => d.value),
      name: '当前能力',
      areaStyle: { color: 'rgba(245, 158, 11, 0.14)' },
      lineStyle: { color: '#f59e0b', width: 2 },
      itemStyle: { color: '#fbbf24' },
    }],
    symbol: 'circle',
    symbolSize: 5,
  }],
}))
</script>

<style scoped lang="scss">
.chart { width: 100%; height: 100%; min-height: 180px; }
</style>
