<template>
  <BasePanel title="分类占比" subtitle="DISTRIBUTION" :loading="loading">
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
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    textStyle: { color: '#fefce8', fontSize: 11 },
    formatter: (params: any) => `${params.name}: ${params.value}%`,
  },
  legend: {
    orient: 'vertical', right: '5%', top: 'center',
    textStyle: { color: 'rgba(254, 252, 232, 0.45)', fontSize: 10 },
    itemWidth: 8, itemHeight: 8, itemGap: 12,
  },
  series: [{
    type: 'pie',
    radius: ['38%', '62%'],
    center: ['40%', '50%'],
    avoidLabelOverlap: false,
    padAngle: 1.5,
    itemStyle: { borderRadius: 3, borderColor: 'rgba(15, 23, 42, 0.8)', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold', color: '#fefce8' }, itemStyle: { shadowBlur: 10, shadowColor: 'rgba(245, 158, 11, 0.3)' } },
    labelLine: { show: false },
    data: props.data.map((item) => ({ name: item.name, value: item.value, itemStyle: { color: getColor(item.name) } })),
  }],
}))

const colorMap: Record<string, string> = {
  '课程学习': '#f59e0b',
  '项目实战': '#fb7185',
  '在线考试': '#2dd4bf',
  '资源下载': '#fbbf24',
  '其他': '#a78bfa',
}

function getColor(name: string): string {
  return colorMap[name] || '#f472b6'
}
</script>

<style scoped lang="scss">
.chart { width: 100%; height: 100%; min-height: 180px; }
</style>
