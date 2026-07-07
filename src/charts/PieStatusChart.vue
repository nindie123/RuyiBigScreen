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
    backgroundColor: 'rgba(4, 18, 40, 0.92)',
    borderColor: 'rgba(54, 207, 201, 0.25)',
    textStyle: { color: '#e8f0fe', fontSize: 12 },
    formatter: (params: any) => `${params.name}: ${params.value}%`,
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { color: 'rgba(232, 240, 254, 0.55)', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 14,
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      padAngle: 2,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(4, 18, 40, 0.8)',
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e8f0fe' },
        itemStyle: { shadowBlur: 12, shadowOffsetX: 0, shadowColor: 'rgba(54, 207, 201, 0.4)' },
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
  '课程学习': '#36cfc9',
  '项目实战': '#4fc3f7',
  '在线考试': '#5cdbd3',
  '资源下载': '#d4a017',
  '其他': '#80deea',
}

function getColor(name: string): string {
  return colorMap[name] || '#4fc3f7'
}
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  min-height: 220px;
}
</style>
