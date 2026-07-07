<template>
  <div class="big-screen" ref="screenRef" :style="screenScale.style">
    <!-- 顶部区域 -->
    <div class="big-screen__header">
      <ScreenHeader />
    </div>

    <!-- 核心指标行 -->
    <div class="big-screen__metrics">
      <slot name="metrics" />
    </div>

    <!-- 主内容区域：三列布局 -->
    <div class="big-screen__main">
      <!-- 左侧列 -->
      <div class="big-screen__column big-screen__column--left">
        <slot name="left-top" />
        <slot name="left-bottom" />
      </div>

      <!-- 中间列 -->
      <div class="big-screen__column big-screen__column--center">
        <slot name="center" />
      </div>

      <!-- 右侧列 -->
      <div class="big-screen__column big-screen__column--right">
        <slot name="right-top" />
        <slot name="right-bottom" />
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="big-screen__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScreenHeader from '../components/ScreenHeader.vue'
import { useScreenResize } from '../utils/resize'

const { screenScale } = useScreenResize()
</script>

<style scoped lang="scss">
.big-screen {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 20px 16px;
  gap: 12px;
  transform-origin: left top;

  &__header {
    flex-shrink: 0;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    display: grid;
    grid-template-columns: 1.2fr 1.8fr 1.2fr;
    gap: 14px;
    min-height: 0;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;

    &--left {
      > :first-child { flex: 1.2; }
      > :last-child { flex: 1; }
    }

    &--center {
      > :first-child { flex: 1; }
    }

    &--right {
      > :first-child { flex: 1.2; }
      > :last-child { flex: 1; }
    }
  }

  &__footer {
    flex-shrink: 0;
    min-height: 100px;
    max-height: 130px;
  }
}
</style>
