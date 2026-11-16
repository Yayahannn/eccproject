export interface MenuItem {
  key: string
  label: string
  icon: string
  path: string
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '首页概览',
    icon: 'LayoutDashboard',
    path: '/',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'Settings',
    path: '/settings',
  },
]
