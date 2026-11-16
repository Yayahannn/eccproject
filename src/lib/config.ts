import { toast } from 'sonner'
import { setConfig, useUser, type Config } from '@kesi/client'

export function initConfig() {
  const { loadUser } = useUser()
  const projectId = import.meta.env.VITE_PROJECT_ID || 'kesi'

  const config: Config = {
    rest: '/rest/',
    language: 'zh-CN',
    projectId,
    // 注册 sonner 作为 SDK 内部的消息提示（如「验证码不能为空」），
    // 否则 SDK 会回退到 alert()。
    toast: {
      info: (message) => toast.info(message),
      success: (message) => toast.success(message),
      error: (message) => toast.error(message),
      warning: (message) => toast.warning(message),
    },
  }

  setConfig(config)
  loadUser() // 加载已保存的登录信息
  console.log('[App] 配置已初始化:', { projectId })
}
