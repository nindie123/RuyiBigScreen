<template>
  <BigScreenLayout>
    <!-- 指标卡片 -->
    <template #metrics>
      <MetricCard
        label="今日访问量"
        :value="store.summary.todayVisits"
        icon="👥"
        color="#4fc3f7"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +12.5%' }"
      />
      <MetricCard
        label="实时订单数"
        :value="store.summary.realtimeOrders"
        icon="📦"
        color="#36cfc9"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +8.3%' }"
      />
      <MetricCard
        label="活跃用户数"
        :value="store.summary.activeUsers"
        icon="👤"
        color="#5cdbd3"
        :loading="store.loading"
        :trend="{ direction: 'up', text: '较昨日 +5.7%' }"
      />
      <MetricCard
        label="系统健康度"
        :value="store.summary.systemHealth"
        icon="❤️"
        color="#d4a017"
        :loading="store.loading"
        :trend="{ direction: 'down', text: '较昨日 -0.3%' }"
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

    <!-- 底部：动态活动列表 -->
    <template #footer>
      <div class="dashboard-activity">
        <BasePanel title="实时动态" subtitle="系统消息">
          <div class="dashboard-activity__list">
            <div
              v-for="item in store.activities"
              :key="item.id"
              class="dashboard-activity__item"
            >
              <span class="dashboard-activity__dot" :class="`dashboard-activity__dot--${item.type}`"></span>
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
    gap: 4px;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(54, 207, 201, 0.04);
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(54, 207, 201, 0.15);
      border-radius: 2px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
    transition: background 0.2s;

    &:hover {
      background: rgba(54, 207, 201, 0.04);
    }

    &:nth-child(odd) {
      background: rgba(54, 207, 201, 0.015);
    }
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;

    &--info { background: #4fc3f7; box-shadow: 0 0 5px rgba(79, 195, 247, 0.35); }
    &--success { background: #36cfc9; box-shadow: 0 0 5px rgba(54, 207, 201, 0.35); }
    &--warning { background: #d4a017; box-shadow: 0 0 5px rgba(212, 160, 23, 0.35); }
    &--alert { background: #ff6b6b; box-shadow: 0 0 6px rgba(255, 107, 107, 0.5); animation: blink 1.2s infinite; }
  }

  &__message {
    flex: 1;
    color: rgba(232, 240, 254, 0.75);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__source {
    color: rgba(232, 240, 254, 0.35);
    font-size: 11px;
    width: 36px;
    text-align: center;
    flex-shrink: 0;
  }

  &__time {
    color: rgba(232, 240, 254, 0.3);
    font-size: 11px;
    font-family: 'Courier New', monospace;
    flex-shrink: 0;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
