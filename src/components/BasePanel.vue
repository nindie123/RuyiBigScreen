<template>
  <div class="base-panel" :class="{ 'base-panel--full': fullHeight }">
    <!-- 四角装饰 -->
    <div class="base-panel__corner base-panel__corner--tl"></div>
    <div class="base-panel__corner base-panel__corner--tr"></div>
    <div class="base-panel__corner base-panel__corner--bl"></div>
    <div class="base-panel__corner base-panel__corner--br"></div>

    <!-- 面板标题 -->
    <div v-if="title" class="base-panel__header">
      <span class="base-panel__decorator"></span>
      <h3 class="base-panel__title">{{ title }}</h3>
      <span v-if="subtitle" class="base-panel__subtitle">{{ subtitle }}</span>
      <div class="base-panel__header-extra">
        <slot name="header-extra" />
      </div>
    </div>

    <!-- 面板内容 -->
    <div class="base-panel__body" :class="{ 'base-panel__body--no-header': !title }">
      <div v-if="loading" class="base-panel__loading">
        <div class="base-panel__spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else-if="error" class="base-panel__error">
        <span>{{ error }}</span>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  loading?: boolean
  error?: string
  fullHeight?: boolean
}>()
</script>

<style scoped lang="scss">
.base-panel {
  background: var(--ruyi-panel-bg, linear-gradient(135deg, rgba(6, 30, 65, 0.85) 0%, rgba(4, 18, 45, 0.92) 100%));
  border: 1px solid var(--ruyi-border, rgba(54, 207, 201, 0.12));
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* 顶部流光边 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(54, 207, 201, 0.5), transparent);
  }

  /* 底部微光边 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(54, 207, 201, 0.2), transparent);
  }

  /* 四角装饰 - 窗棂/卷轴风格 */
  &__corner {
    position: absolute;
    width: 14px;
    height: 14px;
    z-index: 1;
    pointer-events: none;

    &--tl {
      top: 3px; left: 3px;
      border-top: 2px solid rgba(54, 207, 201, 0.3);
      border-left: 2px solid rgba(54, 207, 201, 0.3);
      border-radius: 3px 0 0 0;
    }
    &--tr {
      top: 3px; right: 3px;
      border-top: 2px solid rgba(54, 207, 201, 0.3);
      border-right: 2px solid rgba(54, 207, 201, 0.3);
      border-radius: 0 3px 0 0;
    }
    &--bl {
      bottom: 3px; left: 3px;
      border-bottom: 2px solid rgba(54, 207, 201, 0.3);
      border-left: 2px solid rgba(54, 207, 201, 0.3);
      border-radius: 0 0 0 3px;
    }
    &--br {
      bottom: 3px; right: 3px;
      border-bottom: 2px solid rgba(54, 207, 201, 0.3);
      border-right: 2px solid rgba(54, 207, 201, 0.3);
      border-radius: 0 0 3px 0;
    }
  }

  &--full {
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 12px 20px 8px;
    border-bottom: 1px solid rgba(54, 207, 201, 0.08);
    flex-shrink: 0;
  }

  &__decorator {
    width: 3px;
    height: 16px;
    background: linear-gradient(180deg, var(--ruyi-cyan, #36cfc9), var(--ruyi-blue, #4fc3f7));
    border-radius: 2px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--ruyi-text, #e8f0fe);
    margin: 0;
    letter-spacing: 2px;
  }

  &__subtitle {
    font-size: 11px;
    color: var(--ruyi-text-faint, rgba(232, 240, 254, 0.25));
    margin-left: 12px;
    letter-spacing: 1px;
  }

  &__header-extra {
    margin-left: auto;
  }

  &__body {
    flex: 1;
    padding: 12px 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &--no-header {
      padding: 16px 20px;
    }
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 180px;
    color: var(--ruyi-text-dim, rgba(232, 240, 254, 0.55));
    gap: 12px;
  }

  &__spinner {
    width: 28px;
    height: 28px;
    border: 2px solid rgba(54, 207, 201, 0.15);
    border-top-color: var(--ruyi-cyan, #36cfc9);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__error {
    color: #ff6b6b;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
