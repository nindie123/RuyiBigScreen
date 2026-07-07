<template>
  <div class="metric-card" :style="{ '--accent-color': color, '--accent-glow': color + '33' }">
    <div class="metric-card__icon" v-if="icon">
      <span class="metric-card__icon-text">{{ icon }}</span>
    </div>
    <div class="metric-card__info">
      <span class="metric-card__label">{{ label }}</span>
      <span class="metric-card__value" :class="{ 'metric-card__value--loading': loading }">
        {{ loading ? '---' : displayValue }}
      </span>
    </div>
    <div class="metric-card__trend" v-if="trend && !loading">
      <span class="metric-card__trend-value" :class="`metric-card__trend--${trend.direction}`">
        {{ trend.direction === 'up' ? '↑' : '↓' }} {{ trend.text }}
      </span>
    </div>
    <div class="metric-card__glow"></div>
    <div class="metric-card__shimmer"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCompactNumber } from '../utils/format'

const props = defineProps<{
  label: string
  value: number
  unit?: string
  icon?: string
  color?: string
  loading?: boolean
  trend?: {
    direction: 'up' | 'down'
    text: string
  }
  formatter?: (v: number) => string
}>()

const displayValue = computed(() => {
  if (props.formatter) return props.formatter(props.value)
  const formatted = formatCompactNumber(props.value)
  return props.unit ? `${formatted} ${props.unit}` : formatted
})
</script>

<style scoped lang="scss">
.metric-card {
  position: relative;
  background: linear-gradient(135deg, rgba(6, 26, 55, 0.85) 0%, rgba(8, 35, 70, 0.9) 100%);
  border: 1px solid rgba(54, 207, 201, 0.1);
  border-radius: 10px;
  padding: 18px 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    border-color: rgba(54, 207, 201, 0.28);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(54, 207, 201, 0.12);
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(54, 207, 201, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(54, 207, 201, 0.12);
    margin-bottom: 2px;
  }

  &__icon-text {
    font-size: 18px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 1;
  }

  &__label {
    font-size: 12px;
    color: rgba(232, 240, 254, 0.5);
    letter-spacing: 0.5px;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: var(--ruyi-text, #e8f0fe);
    font-family: 'DINPro', 'Courier New', monospace;
    letter-spacing: 1px;
    text-shadow: 0 0 12px var(--accent-glow, rgba(54, 207, 201, 0.2));

    &--loading {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &__trend {
    z-index: 1;
  }

  &__trend-value {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  &__trend--up {
    color: #36cfc9;
    background: rgba(54, 207, 201, 0.08);
  }

  &__trend--down {
    color: #d4a017;
    background: rgba(212, 160, 23, 0.08);
  }

  /* 背景光晕 */
  &__glow {
    position: absolute;
    top: -50%;
    right: -30%;
    width: 110px;
    height: 110px;
    background: radial-gradient(circle, var(--accent-glow, rgba(54, 207, 201, 0.06)) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  /* 顶部扫描线微光 */
  &__shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-color, #36cfc9), transparent);
    opacity: 0.15;
    animation: shimmer 4s ease-in-out infinite;
    pointer-events: none;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes shimmer {
  0% { left: -60%; }
  100% { left: 160%; }
}
</style>
