<template>
  <header class="screen-header">
    <div class="screen-header__bg"></div>

    <div class="screen-header__side screen-header__side--left">
      <svg width="200" height="60" viewBox="0 0 200 60">
        <path d="M0,30 L20,30" stroke="rgba(245,158,11,0.25)" stroke-width="1" fill="none"/>
        <path d="M20,30 Q40,18 60,26 Q80,34 100,26 Q120,18 140,26 Q160,34 180,26 L190,30" stroke="rgba(245,158,11,0.12)" stroke-width="0.8" fill="none"/>
        <circle cx="20" cy="30" r="2" fill="#f59e0b" opacity="0.3"/>
        <circle cx="60" cy="24" r="1.5" fill="#fb7185" opacity="0.2"/>
        <circle cx="100" cy="26" r="1.5" fill="#f59e0b" opacity="0.2"/>
        <circle cx="140" cy="28" r="1.5" fill="#fb7185" opacity="0.2"/>
        <circle cx="190" cy="30" r="2" fill="#f59e0b" opacity="0.3"/>
      </svg>
    </div>

    <div class="screen-header__center">
      <div class="screen-header__top-line"></div>
      <h1 class="screen-header__title">
        <span class="screen-header__title-chinese">如意数据大屏</span>
        <span class="screen-header__title-divider"></span>
        <span class="screen-header__title-english">RuyiBigScreen</span>
      </h1>
      <p class="screen-header__subtitle">数据可视化教学示范平台 · Data Visualization Dashboard</p>
      <div class="screen-header__bottom-line"></div>
    </div>

    <div class="screen-header__side screen-header__side--right">
      <svg width="200" height="60" viewBox="0 0 200 60">
        <path d="M10,30 L30,30" stroke="rgba(245,158,11,0.25)" stroke-width="1" fill="none"/>
        <path d="M10,30 Q30,18 50,26 Q70,34 90,26 Q110,18 130,26 Q150,34 170,26 L180,30" stroke="rgba(245,158,11,0.12)" stroke-width="0.8" fill="none"/>
        <circle cx="180" cy="30" r="2" fill="#f59e0b" opacity="0.3"/>
        <circle cx="140" cy="24" r="1.5" fill="#fb7185" opacity="0.2"/>
        <circle cx="100" cy="26" r="1.5" fill="#f59e0b" opacity="0.2"/>
        <circle cx="60" cy="28" r="1.5" fill="#fb7185" opacity="0.2"/>
        <circle cx="10" cy="30" r="2" fill="#f59e0b" opacity="0.3"/>
      </svg>
    </div>

    <div class="screen-header__time" v-if="currentTime">
      <span class="screen-header__time-icon">&#9679;</span>
      <span class="screen-header__time-text">{{ currentTime }}</span>
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
  padding: 8px 36px 4px;
  min-height: 72px;
  z-index: 1;

  &__bg {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.35), rgba(251, 113, 133, 0.25), transparent);
  }

  &__center {
    text-align: center;
    flex: 1;
    max-width: 640px;
  }

  &__top-line {
    width: 50%;
    height: 1px;
    margin: 0 auto 6px;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.35), transparent);
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin: 0;
  }

  &__title-chinese {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(180deg, #fefce8 0%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 6px;
  }

  &__title-divider {
    width: 1px;
    height: 20px;
    background: linear-gradient(180deg, transparent, rgba(245, 158, 11, 0.3), transparent);
  }

  &__title-english {
    font-size: 15px;
    font-weight: 300;
    color: rgba(254, 252, 232, 0.4);
    letter-spacing: 3px;
    font-family: 'Courier New', monospace;
  }

  &__subtitle {
    font-size: 10px;
    color: rgba(254, 252, 232, 0.25);
    margin: 4px 0 6px;
    letter-spacing: 2px;
  }

  &__bottom-line {
    width: 30%;
    height: 1px;
    margin: 0 auto;
    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
  }

  &__side {
    flex-shrink: 0;
    opacity: 0.5;
    &--left { margin-right: 14px; }
    &--right { margin-left: 14px; }
  }

  &__time {
    position: absolute;
    right: 36px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(26, 26, 46, 0.5);
    border: 1px solid rgba(245, 158, 11, 0.08);
    border-radius: 4px;
  }

  &__time-icon {
    font-size: 8px;
    color: var(--secondary, #2dd4bf);
    text-shadow: 0 0 6px rgba(45, 212, 191, 0.4);
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  &__time-text {
    font-size: 12px;
    color: rgba(254, 252, 232, 0.6);
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
</style>
