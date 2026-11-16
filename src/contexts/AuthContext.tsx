import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useUser,
  useLogin,
  getSettings,
  getConfig,
} from '@kesi/client'

interface LoginPayload {
  username: string
  password: string
  verifyCode?: string
  remember?: boolean
}

interface AuthContextValue {
  user: any
  isAuthenticated: boolean
  initializing: boolean
  showCode: boolean
  resetVerifyCode: string | null
  login: (payload: LoginPayload) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { setUser, storageKey } = useUser()
  const { showCode, resetVerifyCode, onLogin } = useLogin()

  // 响应式镜像 config.user，保证登出后能即时触发路由重渲染
  const [user, setUserState] = useState<any>(getConfig().user ?? null)
  const [initializing, setInitializing] = useState(true)

  // 清空本地登录态（localStorage / sessionStorage / config）
  const clearSession = useCallback(() => {
    localStorage.removeItem(storageKey)
    sessionStorage.removeItem(storageKey)
    setUser(null)
    setUserState(null)
  }, [storageKey, setUser])

  // 启动时校验本地残留 token 是否对当前 project 仍有效，
  // 无效（401/403，常见于跨 project 残留）则登出回到登录页
  useEffect(() => {
    let active = true
    if (!getConfig().user) {
      setInitializing(false)
      return
    }
    getSettings()
      .catch((err: any) => {
        if (!active) return
        if (err?.status === 401 || err?.status === 403) {
          clearSession()
          navigate('/login', { replace: true })
        }
      })
      .finally(() => {
        if (active) setInitializing(false)
      })
    return () => {
      active = false
    }
  }, [clearSession, navigate])

  const login = useCallback(
    async (payload: LoginPayload) => {
      // onLogin 内部完成请求 + 写入 config/storage + 跳转首页
      const result = await onLogin(payload)
      if (result) setUserState(getConfig().user)
      return result
    },
    [onLogin]
  )

  const logout = useCallback(() => {
    clearSession()
    navigate('/login', { replace: true })
  }, [clearSession, navigate])

  const value: AuthContextValue = {
    user,
    // 同时回看 config，规避登录跳转瞬间 state 未更新的时序问题
    isAuthenticated: Boolean(user || getConfig().user),
    initializing,
    showCode,
    resetVerifyCode,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
