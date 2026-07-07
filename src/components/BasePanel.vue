<template>
  <div class="base-panel" :class="{ 'base-panel--full': fullHeight, 'base-panel--flush': flush }">
    <div v-if="title" class="base-panel__header">
      <div class="base-panel__header-accent"></div>
      <h3 class="base-panel__title">{{ title }}</h3>
      <span v-if="subtitle" class="base-panel__subtitle">{{ subtitle }}</span>
      <div class="base-panel__header-extra">
        <slot name="header-extra" />
      </div>
    </div>
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
  flush?: boolean
}>()
</script>

<style scoped lang="scss">
.base-panel {
  background: var(--panel-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s;

  &:hover { border-color: rgba(245, 158, 11, 0.18); }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.25), transparent);
  }

  &--full { height: 100%; }
  &--flush { border: none; background: transparent; }

  &__header {
    display: flex;
    align-items: center;
    padding: 10px 16px 6px;
    flex-shrink: 0;
  }

  &__header-accent {
    width: 3px;
    height: 12px;
    background: linear-gradient(135deg, #f59e0b, #fb7185);
    border-radius: 2px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  &__title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    margin: 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  &__subtitle {
    font-size: 10px;
    color: var(--text-faint);
    margin-left: 10px;
    letter-spacing: 0.5px;
  }

  &__header-extra { margin-left: auto; }

  &__body {
    flex: 1;
    padding: 10px 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &--no-header { padding: 14px 16px; }
  }

  &__loading, &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 140px;
    color: var(--text-dim);
    gap: 10px;
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(245, 158, 11, 0.1);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__error { color: var(--rose); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
