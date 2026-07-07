<template>
  <div class="metric-card" :style="{ '--accent': color, '--accent-glow': color + '33' }">
    <div class="metric-card__icon" v-if="icon">
      <span class="metric-card__icon-text">{{ icon }}</span>
    </div>
    <div class="metric-card__info">
      <span class="metric-card__label">{{ label }}</span>
      <span class="metric-card__value" :class="{ 'metric-card__value--loading': loading }">
        {{ loading ? '---' : displayValue }}
      </span>
    </div>
    <div class="metric-card__footer">
      <span v-if="trend && !loading" class="metric-card__trend" :class="`metric-card__trend--${trend.direction}`">
        {{ trend.direction === 'up' ? '↑' : '↓' }} {{ trend.text }}
      </span>
    </div>
    <div class="metric-card__glow"></div>
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
  trend?: { direction: 'up' | 'down'; text: string }
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
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(26, 26, 46, 0.7) 100%);
  border: 1px solid rgba(245, 158, 11, 0.08);
  border-radius: 6px;
  padding: 14px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    border-color: rgba(245, 158, 11, 0.18);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.08);
  }

  &__icon {
    width: 30px; height: 30px;
    border-radius: 6px;
    background: rgba(245, 158, 11, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(245, 158, 11, 0.08);
  }
  &__icon-text { font-size: 15px; }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 1;
  }

  &__label {
    font-size: 11px;
    color: rgba(254, 252, 232, 0.4);
    letter-spacing: 0.5px;
  }

  &__value {
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    font-family: 'Courier New', monospace;
    letter-spacing: 0.5px;
    text-shadow: 0 0 20px var(--accent-glow);
    &--loading { animation: pulse 1.5s ease-in-out infinite; }
  }

  &__footer { z-index: 1; margin-top: auto; }

  &__trend {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 3px;
    letter-spacing: 0.3px;
    &--up { color: var(--emerald, #34d399); background: rgba(52, 211, 153, 0.06); }
    &--down { color: var(--coral, #fb7185); background: rgba(251, 113, 133, 0.06); }
  }

  &__glow {
    position: absolute;
    top: -40%;
    right: -20%;
    width: 90px; height: 90px;
    background: radial-gradient(circle, var(--accent-glow, rgba(245, 158, 11, 0.04)) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
</style>
