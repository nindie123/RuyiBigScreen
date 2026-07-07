<template>
  <header class="screen-header">
    <div class="screen-header__decoration screen-header__decoration--left">
      <svg width="200" height="70" viewBox="0 0 200 70">
        <path d="M0,35 L20,35 M20,35 L40,35 M40,35 L60,35" stroke="rgba(64,169,255,0.4)" stroke-width="1" fill="none"/>
        <path d="M60,35 Q90,15 120,35 Q150,55 180,35 L200,35" stroke="rgba(64,169,255,0.25)" stroke-width="1" fill="none"/>
        <circle cx="20" cy="35" r="2" fill="#40a9ff" opacity="0.5"/>
        <circle cx="60" cy="35" r="3" fill="#40a9ff" opacity="0.6"/>
      </svg>
    </div>

    <div class="screen-header__center">
      <div class="screen-header__top-line"></div>
      <h1 class="screen-header__title">
        <span class="screen-header__title-chinese">如意数据大屏</span>
        <span class="screen-header__title-divider"></span>
        <span class="screen-header__title-english">RuyiBigScreen</span>
      </h1>
      <p class="screen-header__subtitle">数据可视化教学示范平台 | Data Visualization Dashboard</p>
      <div class="screen-header__bottom-line"></div>
    </div>

    <div class="screen-header__decoration screen-header__decoration--right">
      <svg width="200" height="70" viewBox="0 0 200 70">
        <path d="M0,35 L20,35 Q50,15 80,35 Q110,55 140,35 L200,35" stroke="rgba(64,169,255,0.25)" stroke-width="1" fill="none"/>
        <circle cx="180" cy="35" r="2" fill="#40a9ff" opacity="0.5"/>
        <circle cx="140" cy="35" r="3" fill="#40a9ff" opacity="0.6"/>
      </svg>
    </div>

    <div class="screen-header__time" v-if="currentTime">
      <div class="screen-header__time-icon">🕐</div>
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
  padding: 16px 40px 10px;
  min-height: 90px;

  &__center {
    text-align: center;
    flex: 1;
    max-width: 700px;
  }

  &__top-line {
    width: 60%;
    height: 2px;
    margin: 0 auto 10px;
    background: linear-gradient(90deg, transparent, rgba(64, 169, 255, 0.6), transparent);
    border-radius: 1px;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 0;
  }

  &__title-chinese {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(180deg, #e8f0fe 0%, #40a9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 6px;
  }

  &__title-divider {
    width: 1px;
    height: 24px;
    background: linear-gradient(180deg, transparent, rgba(64, 169, 255, 0.5), transparent);
  }

  &__title-english {
    font-size: 18px;
    font-weight: 300;
    color: rgba(232, 240, 254, 0.6);
    letter-spacing: 3px;
    font-family: 'DINPro', 'Segoe UI', sans-serif;
  }

  &__subtitle {
    font-size: 12px;
    color: rgba(232, 240, 254, 0.35);
    margin: 6px 0 10px;
    letter-spacing: 2px;
  }

  &__bottom-line {
    width: 40%;
    height: 1px;
    margin: 0 auto;
    background: linear-gradient(90deg, transparent, rgba(64, 169, 255, 0.3), transparent);
  }

  &__decoration {
    flex-shrink: 0;
    opacity: 0.6;

    &--left {
      margin-right: 20px;
    }

    &--right {
      margin-left: 20px;
    }
  }

  &__time {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(6, 30, 65, 0.6);
    border: 1px solid rgba(64, 169, 255, 0.15);
    border-radius: 6px;
  }

  &__time-icon {
    font-size: 16px;
  }

  &__time-text {
    font-size: 14px;
    color: rgba(232, 240, 254, 0.8);
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }
}
</style>
