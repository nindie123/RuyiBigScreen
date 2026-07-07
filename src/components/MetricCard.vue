<template>
  <div class="metric-card" :style="{ '--accent-color': color }">
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
    <div class="metric-card__bg-glow"></div>
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
  background: linear-gradient(135deg, rgba(6, 30, 65, 0.8) 0%, rgba(12, 40, 80, 0.85) 100%);
  border: 1px solid rgba(64, 169, 255, 0.12);
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    border-color: rgba(64, 169, 255, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(64, 169, 255, 0.15);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(64, 169, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(64, 169, 255, 0.2);
    margin-bottom: 4px;
  }

  &__icon-text {
    font-size: 20px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 1;
  }

  &__label {
    font-size: 13px;
    color: rgba(232, 240, 254, 0.6);
    letter-spacing: 0.5px;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: #e8f0fe;
    font-family: 'DINPro', 'Courier New', monospace;
    letter-spacing: 1px;

    &--loading {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &__trend {
    z-index: 1;
  }

  &__trend-value {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
  }

  &__trend--up {
    color: #52c41a;
    background: rgba(82, 196, 26, 0.1);
  }

  &__trend--down {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.1);
  }

  &__bg-glow {
    position: absolute;
    top: -50%;
    right: -30%;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, var(--accent-color, rgba(64, 169, 255, 0.08)) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
</style>
