import { type ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { menuConfig, type MenuItem } from '@/data/menu'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard, Settings, Menu, ChevronDown, ChevronLeft, LogOut,
} from 'lucide-react'

const iconMap: Record<string, ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
}

function MenuItemComponent({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = location.pathname === item.path
  const isParentActive = item.children?.some(c => location.pathname === c.path)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open)
    } else {
      navigate(item.path)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground
          ${isActive || isParentActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'}
          ${depth > 0 ? 'ml-4 py-1.5 text-xs' : ''}
        `}
      >
        {iconMap[item.icon]}
        <span className="flex-1 text-left">{item.label}</span>
        {hasChildren && (
          <ChevronDown className={`h-3 w-3 transition-transform ${open || isParentActive ? 'rotate-180' : ''}`} />
        )}
      </button>
      {hasChildren && (open || isParentActive) && (
        <div className="mt-0.5">
          {item.children!.map(child => (
            <MenuItemComponent key={child.key} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          K
        </div>
        <div>
          <h1 className="text-sm font-semibold">KESI 应用</h1>
          <p className="text-[10px] text-muted-foreground">IoT Platform</p>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-2">
        {menuConfig.map(item => (
          <MenuItemComponent key={item.key} item={item} />
        ))}
      </ScrollArea>
      <Separator />
      <div className="space-y-1 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => { navigate('/'); onNavigate?.() }}
        >
          <ChevronLeft className="h-4 w-4" />
          返回首页
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => { logout(); onNavigate?.() }}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r bg-sidebar-background md:block">
        <SidebarContent />
      </aside>

      {/* Mobile header + sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center gap-2 border-b px-4 md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">KESI 应用</span>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
