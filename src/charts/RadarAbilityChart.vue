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
    backgroundColor: 'rgba(4, 18, 40, 0.92)',
    borderColor: 'rgba(54, 207, 201, 0.25)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
  },
  radar: {
    indicator: props.data.map((d) => ({ name: d.name, max: d.max })),
    shape: 'circle',
    splitNumber: 4,
    radius: '68%',
    axisName: {
      color: 'rgba(232, 240, 254, 0.55)',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: { color: 'rgba(54, 207, 201, 0.08)' },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(54, 207, 201, 0.02)', 'rgba(79, 195, 247, 0.04)'],
      },
    },
    axisLine: {
      lineStyle: { color: 'rgba(54, 207, 201, 0.1)' },
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
            color: 'rgba(54, 207, 201, 0.18)',
          },
          lineStyle: {
            color: '#36cfc9',
            width: 2,
          },
          itemStyle: {
            color: '#4fc3f7',
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
