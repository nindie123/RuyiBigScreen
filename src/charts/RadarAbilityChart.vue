<template>
  <BasePanel title="能力雷达" subtitle="综合评估" :loading="loading">
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
    backgroundColor: 'rgba(6, 30, 65, 0.9)',
    borderColor: 'rgba(64, 169, 255, 0.3)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
  },
  radar: {
    indicator: props.data.map((d) => ({ name: d.name, max: d.max })),
    shape: 'circle',
    splitNumber: 4,
    axisName: {
      color: 'rgba(232, 240, 254, 0.65)',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: { color: 'rgba(64, 169, 255, 0.1)' },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(64, 169, 255, 0.02)', 'rgba(64, 169, 255, 0.05)'],
      },
    },
    axisLine: {
      lineStyle: { color: 'rgba(64, 169, 255, 0.12)' },
    },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: props.data.map((d) => d.value),
          name: '当前能力',
          areaStyle: {
            color: 'rgba(64, 169, 255, 0.2)',
          },
          lineStyle: {
            color: '#40a9ff',
            width: 2,
          },
          itemStyle: {
            color: '#40a9ff',
          },
        },
      ],
      symbol: 'circle',
      symbolSize: 6,
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
