import { useEffect, useState } from 'react'
import titleBg from '@/images/title bg@2x.png'
import logoImg from '@/images/logo@2x.png'
import sunIcon from '@/images/太阳@2x.png'
import msgIcon from '@/images/icon-消息@2x.png'
import userIcon from '@/images/icon-个人@2x.png'
import dropIcon from '@/images/下拉@2x.png'
import lightFx from '@/images/光效 2@2x.png'

function formatNow(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function TopBar() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[64px]">
      {/* 渐变底色兜底（右侧透明 → 左侧深色） */}
      <div className="bg-topbar-gradient absolute inset-0" aria-hidden />
      {/* 顶栏底图（1920x74 含科技折角装饰） */}
      <img src={titleBg} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* 标题下青色光效（在 logo 图片正下方；切图亮带在下半段且本身很淡，
          故 object-bottom 对准亮带、不再叠加透明度） */}
      <img
        src={lightFx}
        alt=""
        className="absolute top-[45px] left-1/2 h-[30px] w-[520px] -translate-x-1/2 object-cover object-bottom"
        aria-hidden
      />

      <div className="relative flex h-full items-center justify-between px-6">
        {/* 左：天气 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src={sunIcon} alt="" className="h-5 w-5" aria-hidden />
          <span>18~26°C 晴转多云</span>
        </div>

        {/* 中：标题（logo+标题字整体切图） */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img src={logoImg} alt="数智安防应急指挥中心" className="h-8 w-auto" />
        </div>

        {/* 右：时间 / 通知 / 语言 / 用户 */}
        <div className="flex items-center gap-4 text-sm">
          <time className="tabular-nums text-muted-foreground">{formatNow(now)}</time>

          <button className="pointer-events-auto relative flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent/60" aria-label="通知">
            <img src={msgIcon} alt="" className="h-6 w-6" aria-hidden />
            <span className="absolute -top-0.5 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] leading-none text-destructive-foreground">
              1
            </span>
          </button>

          <button className="pointer-events-auto flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-accent/60">
            <span className="text-xs tracking-wide text-muted-foreground">CN</span>
            <img src={dropIcon} alt="" className="h-3 w-4" aria-hidden />
          </button>

          <button className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent/60" aria-label="个人中心">
            <img src={userIcon} alt="" className="h-7 w-7" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
