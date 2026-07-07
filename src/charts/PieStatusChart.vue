<template>
  <BasePanel title="分类占比" subtitle="业务分布" :loading="loading">
    <v-chart class="chart" :option="chartOption" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import 'echarts'
import BasePanel from '../components/BasePanel.vue'
import type { CategoryItem } from '../types/dashboard'

const props = defineProps<{
  data: CategoryItem[]
  loading?: boolean
}>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(6, 30, 65, 0.9)',
    borderColor: 'rgba(64, 169, 255, 0.3)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
    formatter: (params: any) => `${params.name}: ${params.value}%`,
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { color: 'rgba(232, 240, 254, 0.6)', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 14,
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      padAngle: 2,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(6, 30, 65, 0.8)',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e8f0fe' },
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
      labelLine: { show: false },
      data: props.data.map((item) => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: getColor(item.name) },
      })),
    },
  ],
}))

const colorMap: Record<string, string> = {
  '科技': '#40a9ff',
  '教育': '#36cfc9',
  '医疗': '#73d13d',
  '金融': '#ffc53d',
  '其他': '#ff7a45',
}

function getColor(name: string): string {
  return colorMap[name] || '#597ef7'
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 220px;
}
</style>
