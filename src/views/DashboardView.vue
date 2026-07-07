<template>
  <BigScreenLayout>
    <!-- 指标卡片 -->
    <template #metrics>
      <MetricCard
        label="今日访问量"
        :value="store.summary.todayVisits"
        icon="👥"
        color="#f59e0b"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +12.5%' }"
      />
      <MetricCard
        label="实时订单数"
        :value="store.summary.realtimeOrders"
        icon="📦"
        color="#2dd4bf"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +8.3%' }"
      />
      <MetricCard
        label="活跃用户数"
        :value="store.summary.activeUsers"
        icon="👤"
        color="#fb7185"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +5.7%' }"
      />
      <MetricCard
        label="系统健康度"
        :value="store.summary.systemHealth"
        icon="❤️"
        color="#34d399"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +0.3%' }"
        :formatter="(v: number) => v.toFixed(1) + ' %'"
      />
    </template>

    <!-- 左侧-上：访问趋势 -->
    <template #left-top>
      <LineTrendChart :data="store.trend" :loading="store.loading" />
    </template>

    <!-- 左侧-下：分类占比 -->
    <template #left-bottom>
      <PieStatusChart :data="store.categories" :loading="store.loading" />
    </template>

    <!-- 中间：如意数据中枢 -->
    <template #center>
      <DataHubChart :data="store.hubNodes" :loading="store.loading" />
    </template>

    <!-- 右侧-上：城市排名 -->
    <template #right-top>
      <BarRankingChart :data="store.ranking" :loading="store.loading" />
    </template>

    <!-- 右侧-下：能力雷达 -->
    <template #right-bottom>
      <RadarAbilityChart :data="store.radar" :loading="store.loading" />
    </template>

    <!-- 底部：实时动态 -->
    <template #footer>
      <div class="dashboard-activity">
        <BasePanel title="实时动态" subtitle="SYSTEM FEED" flush>
          <div class="dashboard-activity__list">
            <div
              v-for="item in store.activities"
              :key="item.id"
              class="dashboard-activity__item"
              :class="'dashboard-activity__item--' + item.type"
            >
              <span class="dashboard-activity__dot" :class="'dashboard-activity__dot--' + item.type"></span>
              <span class="dashboard-activity__message">{{ item.message }}</span>
              <span class="dashboard-activity__source">{{ item.source }}</span>
              <span class="dashboard-activity__time">{{ item.time }}</span>
            </div>
          </div>
        </BasePanel>
      </div>
    </template>
  </BigScreenLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BigScreenLayout from '../layouts/BigScreenLayout.vue'
import BasePanel from '../components/BasePanel.vue'
import MetricCard from '../components/MetricCard.vue'
import LineTrendChart from '../charts/LineTrendChart.vue'
import BarRankingChart from '../charts/BarRankingChart.vue'
import PieStatusChart from '../charts/PieStatusChart.vue'
import RadarAbilityChart from '../charts/RadarAbilityChart.vue'
import DataHubChart from '../charts/DataHubChart.vue'
import { useDashboardStore } from '../stores/dashboardStore'
import { logger } from '../logs/logger'

const store = useDashboardStore()

onMounted(() => {
  logger.info('[DashboardView] 页面已挂载，启动实时刷新')
  store.loadAllData()
  store.startRealtime()
})

onUnmounted(() => {
  logger.info('[DashboardView] 页面卸载，停止实时刷新')
  store.stopRealtime()
})
</script>

<style scoped lang="scss">
.dashboard-activity {
  height: 100%;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow-y: auto;
    padding-right: 2px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 3px;
    font-size: 11px;
    transition: background 0.2s;

    &:hover { background: rgba(245, 158, 11, 0.03); }
    &:nth-child(odd) { background: rgba(30, 41, 59, 0.3); }

    &--warning { border-left: 2px solid rgba(245, 158, 11, 0.3); }
    &--alert { border-left: 2px solid rgba(244, 114, 182, 0.3); }
  }

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;

    &--info { background: var(--primary, #f59e0b); }
    &--success { background: var(--secondary, #2dd4bf); box-shadow: 0 0 5px rgba(45, 212, 191, 0.3); }
    &--warning { background: var(--coral, #fb7185); box-shadow: 0 0 5px rgba(251, 113, 133, 0.3); }
    &--alert { background: var(--rose, #f472b6); box-shadow: 0 0 5px rgba(244, 114, 182, 0.4); animation: blink 1.2s infinite; }
  }

  &__message {
    flex: 1;
    color: rgba(240, 240, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__source {
    color: rgba(240, 240, 255, 0.2);
    font-size: 10px;
    width: 32px;
    text-align: center;
    flex-shrink: 0;
  }

  &__time {
    color: rgba(240, 240, 255, 0.2);
    font-size: 10px;
    font-family: 'Courier New', monospace;
    flex-shrink: 0;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
</style>
