import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/pages/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { CommandScreen } from '@/pages/screen/CommandScreen'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm mt-1">页面开发中...</p>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initializing } = useAuth()

  // 启动时正在校验本地登录态，避免残留 token 闪过首页
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        正在校验登录状态...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Routes>
              {/* 首页 = 全屏指挥大屏（不走 AppLayout） */}
              <Route path="/" element={<CommandScreen />} />

              {/* 管理后台页面走 AppLayout */}
              <Route
                path="console/*"
                element={
                  <AppLayout>
                    <Routes>
                      <Route path="" element={<Navigate to="/console/home" replace />} />
                      <Route path="home" element={<DashboardPage />} />
                      <Route path="settings" element={<PlaceholderPage title="系统设置" />} />
                    </Routes>
                  </AppLayout>
                }
              />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
    <Toaster richColors position="top-center" />
    </>
  )
}
