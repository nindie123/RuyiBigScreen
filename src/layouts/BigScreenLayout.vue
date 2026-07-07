<template>
  <div class="big-screen" :style="screenScale.style">
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
      <div class="big-screen__column big-screen__column--left">
        <slot name="left-top" />
        <slot name="left-bottom" />
      </div>
      <div class="big-screen__column big-screen__column--center">
        <slot name="center" />
      </div>
      <div class="big-screen__column big-screen__column--right">
        <slot name="right-top" />
        <slot name="right-bottom" />
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="big-screen__footer">
      <slot name="footer" />
    </div>

    <!-- 环境水印 -->
    <div class="big-screen__watermark">RUYI BIG SCREEN v2.0 · DEMO</div>
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
  padding: 0 24px 12px;
  gap: 10px;
  transform-origin: left top;
  position: relative;

  &__watermark {
    position: absolute;
    bottom: 20px;
    right: 36px;
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(102, 126, 234, 0.12);
    font-family: 'Courier New', monospace;
    pointer-events: none;
    z-index: 0;
  }

  &__header {
    flex-shrink: 0;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    display: grid;
    grid-template-columns: 1.2fr 1.9fr 1.2fr;
    gap: 12px;
    min-height: 0;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;

    &--left {
      > :first-child { flex: 1.3; }
      > :last-child { flex: 1; }
    }
    &--center {
      > :first-child { flex: 1; }
    }
    &--right {
      > :first-child { flex: 1.3; }
      > :last-child { flex: 1; }
    }
  }

  &__footer {
    flex-shrink: 0;
    min-height: 90px;
    max-height: 115px;
  }
}
</style>
