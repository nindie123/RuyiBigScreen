<template>
  <header class="screen-header">
    <!-- 左侧装饰 -->
    <div class="screen-header__side screen-header__side--left">
      <svg width="220" height="70" viewBox="0 0 220 70">
        <path d="M0,35 L15,35" stroke="rgba(54,207,201,0.3)" stroke-width="1" fill="none"/>
        <path d="M15,35 Q30,20 50,30 Q70,40 90,30 Q110,20 130,30 Q150,40 170,30 L185,35" stroke="rgba(54,207,201,0.15)" stroke-width="0.8" fill="none"/>
        <circle cx="15" cy="35" r="2.5" fill="#36cfc9" opacity="0.4"/>
        <circle cx="45" cy="28" r="1.5" fill="#4fc3f7" opacity="0.3"/>
        <circle cx="85" cy="30" r="1.5" fill="#36cfc9" opacity="0.3"/>
        <circle cx="125" cy="32" r="1.5" fill="#4fc3f7" opacity="0.3"/>
        <circle cx="185" cy="35" r="2.5" fill="#36cfc9" opacity="0.4"/>
        <line x1="0" y1="32" x2="0" y2="38" stroke="rgba(54,207,201,0.2)" stroke-width="0.5"/>
        <line x1="5" y1="33" x2="5" y2="37" stroke="rgba(54,207,201,0.15)" stroke-width="0.5"/>
      </svg>
    </div>

    <!-- 标题区 -->
    <div class="screen-header__center">
      <div class="screen-header__top-line"></div>
      <h1 class="screen-header__title">
        <span class="screen-header__title-icon">☯</span>
        <span class="screen-header__title-chinese">如意数据大屏</span>
        <span class="screen-header__title-divider"></span>
        <span class="screen-header__title-english">RuyiBigScreen</span>
      </h1>
      <p class="screen-header__subtitle">数据可视化教学示范平台 · Data Visualization Dashboard</p>
      <div class="screen-header__bottom-line"></div>
    </div>

    <!-- 右侧装饰 -->
    <div class="screen-header__side screen-header__side--right">
      <svg width="220" height="70" viewBox="0 0 220 70">
        <path d="M35,35 L20,35" stroke="rgba(54,207,201,0.3)" stroke-width="1" fill="none"/>
        <path d="M35,35 Q50,20 70,30 Q90,40 110,30 Q130,20 150,30 Q170,40 190,30 L205,35" stroke="rgba(54,207,201,0.15)" stroke-width="0.8" fill="none"/>
        <circle cx="205" cy="35" r="2.5" fill="#36cfc9" opacity="0.4"/>
        <circle cx="175" cy="28" r="1.5" fill="#4fc3f7" opacity="0.3"/>
        <circle cx="135" cy="30" r="1.5" fill="#36cfc9" opacity="0.3"/>
        <circle cx="95" cy="32" r="1.5" fill="#4fc3f7" opacity="0.3"/>
        <circle cx="35" cy="35" r="2.5" fill="#36cfc9" opacity="0.4"/>
        <line x1="220" y1="32" x2="220" y2="38" stroke="rgba(54,207,201,0.2)" stroke-width="0.5"/>
      </svg>
    </div>

    <!-- 时间 -->
    <div class="screen-header__time" v-if="currentTime">
      <div class="screen-header__time-dot"></div>
      <div class="screen-header__time-text">{{ currentTime }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { formatDate } from '../utils/format'

const currentTime = ref('')

let timer: ReturnType<typeof setInterval> | null = null

function updateTime() {
  currentTime.value = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.screen-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 40px 6px;
  min-height: 80px;

  &__center {
    text-align: center;
    flex: 1;
    max-width: 680px;
  }

  &__top-line {
    width: 55%;
    height: 2px;
    margin: 0 auto 8px;
    background: linear-gradient(90deg, transparent, rgba(54, 207, 201, 0.5), transparent);
    border-radius: 1px;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin: 0;
  }

  &__title-icon {
    font-size: 22px;
    opacity: 0.5;
    color: #36cfc9;
  }

  &__title-chinese {
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(180deg, #e8f0fe 0%, #4fc3f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 8px;
  }

  &__title-divider {
    width: 1px;
    height: 22px;
    background: linear-gradient(180deg, transparent, rgba(54, 207, 201, 0.4), transparent);
  }

  &__title-english {
    font-size: 16px;
    font-weight: 300;
    color: rgba(232, 240, 254, 0.5);
    letter-spacing: 3px;
    font-family: 'DINPro', 'Segoe UI', sans-serif;
  }

  &__subtitle {
    font-size: 11px;
    color: rgba(232, 240, 254, 0.3);
    margin: 5px 0 8px;
    letter-spacing: 2px;
  }

  &__bottom-line {
    width: 35%;
    height: 1px;
    margin: 0 auto;
    background: linear-gradient(90deg, transparent, rgba(54, 207, 201, 0.25), transparent);
  }

  &__side {
    flex-shrink: 0;
    opacity: 0.6;
    &--left { margin-right: 16px; }
    &--right { margin-left: 16px; }
  }

  &__time {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(6, 30, 65, 0.5);
    border: 1px solid rgba(54, 207, 201, 0.1);
    border-radius: 4px;
  }

  &__time-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #36cfc9;
    box-shadow: 0 0 6px rgba(54, 207, 201, 0.5);
    animation: breathe 2s ease-in-out infinite;
  }

  &__time-text {
    font-size: 13px;
    color: rgba(232, 240, 254, 0.7);
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }
}

@keyframes breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
