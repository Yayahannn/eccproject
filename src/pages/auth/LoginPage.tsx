import { useState, useEffect, type FC, type InputHTMLAttributes } from 'react'
import { createAPI } from '@kesi/client' // createAPI 用于验证码拉取
import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

// 验证码图片组件：拉取后端图形验证码，点击图片可刷新
const ImageCode: FC<{
  input: InputHTMLAttributes<HTMLInputElement>
  resetVerifyCode: string | null
}> = ({ input, resetVerifyCode }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const getImageCode = () => {
    setLoading(true)
    // 请求 2x 分辨率：高位图缩小显示更清晰（位图放大才会发糊）
    const query = {
      height: 64,
      width: 240,
      captchaLen: 4,
      maxSkew: 0.7,
      dotCount: 80,
    }
    createAPI({ resource: 'core/auth/captcha', ignoreAuthorization: true })
      .fetch('', { params: { query: JSON.stringify(query) } })
      .then((res) => {
        setUrl(res.data.data)
      })
      .catch((err) => {
        console.error('获取验证码失败:', err)
      })
      .finally(() => setLoading(false))
  }

  // resetVerifyCode 变化（如登录失败）时刷新验证码
  useEffect(() => {
    getImageCode()
  }, [resetVerifyCode])

  return (
    <div className="flex gap-2">
      <input
        {...input}
        className={cn(inputClass, 'flex-1 min-w-0')}
        placeholder="请输入验证码"
      />
      <button
        type="button"
        onClick={getImageCode}
        title="点击刷新验证码"
        className="flex h-9 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted/40 transition-colors hover:bg-muted"
      >
        {loading || !url ? (
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <img
            src={url}
            alt="验证码"
            className="h-full w-full object-contain"
          />
        )}
      </button>
    </div>
  )
}

export function LoginPage() {
  const { login, showCode, resetVerifyCode } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [verifyCode, setVerifyCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // login 内部完成请求+跳转；验证码为空时返回 undefined，需阻止后续
      const result = await login({
        username,
        password,
        // 只有显示验证码时才传递 verifyCode 参数
        ...(showCode ? { verifyCode } : {}),
        remember: true,
      })
      if (!result) return
      // 登录成功：login 内部已自动跳转首页
    } catch (err: any) {
      console.error('登录失败:', err)
      setError(err?.message || err?._error || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
            K
          </div>
          <CardTitle className="text-xl">KESI 管理平台</CardTitle>
          <p className="text-sm text-muted-foreground">请登录以继续</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 错误提示 */}
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="请输入用户名"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputClass, 'pr-10')}
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 验证码：登录失败后由后端触发显示 */}
            {showCode && (
              <div className="space-y-2">
                <label className="text-sm font-medium">验证码</label>
                <ImageCode
                  input={{
                    value: verifyCode,
                    onChange: (e) => setVerifyCode(e.target.value),
                    required: true,
                  }}
                  resetVerifyCode={resetVerifyCode}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登 录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
