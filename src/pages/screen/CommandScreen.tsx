import { useEffect } from 'react'
import { TopBar } from '@/components/screen/TopBar'
import { SideMenu } from '@/components/screen/SideMenu'
import { MapControls } from '@/components/screen/MapControls'
import { AlertPanel } from '@/components/screen/AlertPanel'
import { LayerBar } from '@/components/screen/LayerBar'
import { MapStage } from '@/components/screen/MapStage'

/**
 * 数智安防应急指挥中心 · 全屏大屏首页
 * 布局：全屏地图打底，顶栏 / 左侧菜单 / 右侧预警面板 / 底部图层条 / 指南针控件悬浮其上
 */
export function CommandScreen() {
  // 大屏页面隐藏整页滚动（html.screen-mode），离开时移除
  useEffect(() => {
    document.documentElement.classList.add('screen-mode')
    return () => document.documentElement.classList.remove('screen-mode')
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      <MapStage />
      <TopBar />
      <SideMenu />
      <MapControls />
      <AlertPanel />
      <LayerBar />
    </div>
  )
}
