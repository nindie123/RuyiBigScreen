/**
 * 如意数据大屏 - 应用入口
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { isMock } from './services/dataSource'
import { logger } from './logs/logger'

async function bootstrap() {
  const app = createApp(App)

  // 注册 Pinia 状态管理
  app.use(createPinia())

  // Mock 模式下启动 MSW
  if (isMock) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
      })
      logger.info('[Main] MSW Mock 服务已启动')
    } catch (err) {
      logger.error('[Main] MSW 启动失败', err)
    }
  }

  // 挂载应用
  app.mount('#app')
  logger.info('[Main] 如意数据大屏已启动')
}

bootstrap()
