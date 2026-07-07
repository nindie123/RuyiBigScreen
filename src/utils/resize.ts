/**
 * 如意数据大屏 - 自适应缩放工具
 *
 * 基于 1920x1080 设计稿，按比例缩放页面。
 * 使用 CSS transform scale 实现自适应。
 */

import { onMounted, onUnmounted, ref } from 'vue'

/** 设计稿尺寸 */
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

interface ScreenScale {
  scale: number
  style: {
    transform: string
    transformOrigin: string
    width: string
    height: string
  }
}

/**
 * 大屏自适应 composable
 * 保持 16:9 比例等比缩放
 */
export function useScreenResize() {
  const screenScale = ref<ScreenScale>({
    scale: 1,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'left top',
      width: `${DESIGN_WIDTH}px`,
      height: `${DESIGN_HEIGHT}px`,
    },
  })

  /** 计算缩放比例 */
  const calcScale = (): void => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const scaleX = windowWidth / DESIGN_WIDTH
    const scaleY = windowHeight / DESIGN_HEIGHT
    const scale = Math.min(scaleX, scaleY)

    screenScale.value = {
      scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
        width: `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`,
      },
    }
  }

  onMounted(() => {
    calcScale()
    window.addEventListener('resize', calcScale)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calcScale)
  })

  return {
    screenScale,
  }
}
