<template>
  <div class="base-panel" :class="{ 'base-panel--full': fullHeight }">
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
  background: linear-gradient(135deg, rgba(6, 30, 65, 0.85) 0%, rgba(4, 20, 50, 0.90) 100%);
  border: 1px solid rgba(64, 169, 255, 0.15);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(64, 169, 255, 0.6), transparent);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64, 169, 255, 0.3), transparent);
  }

  &--full {
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 14px 20px 10px;
    border-bottom: 1px solid rgba(64, 169, 255, 0.1);
    flex-shrink: 0;
  }

  &__decorator {
    width: 3px;
    height: 16px;
    background: linear-gradient(180deg, #40a9ff, #36cfc9);
    border-radius: 2px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #e8f0fe;
    margin: 0;
    letter-spacing: 1px;
  }

  &__subtitle {
    font-size: 12px;
    color: rgba(232, 240, 254, 0.5);
    margin-left: 12px;
  }

  &__header-extra {
    margin-left: auto;
  }

  &__body {
    flex: 1;
    padding: 16px 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &--no-header {
      padding: 20px;
    }
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    color: rgba(232, 240, 254, 0.5);
    gap: 12px;
  }

  &__spinner {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(64, 169, 255, 0.2);
    border-top-color: #40a9ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__error {
    color: #ff4d4f;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
