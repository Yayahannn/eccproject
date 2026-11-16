import { useState } from 'react'
import { screenMenus } from '@/data/screen'

/**
 * 左侧悬浮功能菜单
 * 弧带为 SVG 绘制的月牙形（凸右，上下对称）——任意宽高完整显示、不变形；
 * 菜单项沿弧带中轴弯曲排列（偏移量按中轴曲线计算）；选中态为沿弧梯形透视片。
 */
/* 菜单项沿弧带中轴的水平偏移（px，中轴顶/底 ~74、中部 ~92，容器中心 68） */
const ARC_OFFSETS = [12, 20, 24, 23, 18]

export function SideMenu() {
  const [active, setActive] = useState('global')

  return (
    <nav className="absolute top-[100px] left-7 z-30 flex  w-[136px] flex-col gap-[80px] pt-[40px]">
      {/* SVG 月牙弧带（左缘发光弧线 + 右缘淡弧，填充向右淡出） */}
      <ArcBand />

      {screenMenus.map((item, i) => {
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className="group relative flex h-[94px] w-full flex-col items-center justify-center gap-2"
            style={{ transform: `translateX(${ARC_OFFSETS[i] ?? 0}px)` }}
          >
            {/* 选中态：沿弧梯形透视片（顶边右端低 18px、右下角内收 30px） */}
            {isActive && <ActiveFrame />}
            <img
              src={item.icon}
              alt=""
              className={`h-10 w-10 transition-transform group-hover:scale-110 ${isActive ? '' : 'opacity-70'}`}
              aria-hidden
            />
            <span
              className={`text-[13px] leading-none ${
                isActive ? 'font-medium text-foreground text-glow' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/* 月牙弧带：颜色走 index.css token（--screen-deep / --primary） */
function ArcBand() {
  return (
    <svg
      viewBox="0 0 136 980"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="arc-band-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="color-mix(in srgb, var(--screen-deep) 85%, transparent)" />
          <stop offset="0.6" stopColor="color-mix(in srgb, var(--screen-deep) 50%, transparent)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--screen-deep) 0%, transparent)" />
        </linearGradient>
        <linearGradient id="arc-line-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="color-mix(in srgb, var(--primary) 0%, transparent)" />
          <stop offset="0.3" stopColor="color-mix(in srgb, var(--primary) 85%, transparent)" />
          <stop offset="0.7" stopColor="color-mix(in srgb, var(--primary) 85%, transparent)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 0%, transparent)" />
        </linearGradient>
      </defs>
      {/* 带子填充：左缘弧 + 右缘弧围成月牙 */}
      <path d="M 18 0 Q 78 490 18 980 L 130 980 Q 142 490 130 0 Z" fill="url(#arc-band-fill)" />
      {/* 左缘发光弧线（粗淡光晕 + 细亮线） */}
      <path d="M 18 0 Q 78 490 18 980" fill="none" stroke="url(#arc-line-glow)" strokeWidth="6" opacity="0.35" />
      <path d="M 18 0 Q 78 490 18 980" fill="none" stroke="url(#arc-line-glow)" strokeWidth="1.5" />
      {/* 右缘淡弧 */}
      <path d="M 130 0 Q 142 490 130 980" fill="none" stroke="url(#arc-line-glow)" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

/* 选中态梯形片：fill 青色半透明，stroke 橙渐变（269deg：右亮左隐） */
function ActiveFrame() {
  return (
    <svg
      viewBox="0 0 93 138"
      className="absolute top-1/2 left-1/2 -z-10 h-[138px] w-[93px] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <defs>
        <linearGradient id="menu-active-border" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="var(--menu-active-line-a)" />
          <stop offset="100%" stopColor="var(--menu-active-line-b)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 93 18 L 63 138 L 0 138 Z"
        fill="var(--menu-active-fill)"
        fillOpacity="0.12"
        stroke="url(#menu-active-border)"
        strokeWidth="1"
      />
    </svg>
  )
}
