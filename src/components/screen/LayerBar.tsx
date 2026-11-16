import { useEffect, useState } from 'react'
import { screenLayers } from '@/data/screen'
import { fetchLayerCounts } from '@/services/screen'
import bottomBg from '@/images/bottom@2x.png'
import frameImg from '@/images/底框@2x.png'

/**
 * 底部图层快捷开关条（bottom.png 长条底图 + 底框按钮 + 数量徽标）
 * 数量：KESI 各表真实计数（fetchLayerCounts），失败回退演示值。
 */
export function LayerBar() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(
    () => new Set(screenLayers.map((l) => l.key)),
  )
  // 初始演示计数，后端到达后按图层 key 覆盖
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(screenLayers.map((l) => [l.key, l.count])),
  )

  useEffect(() => {
    let active = true
    fetchLayerCounts().then((r) => {
      if (active && r.source === 'backend') setCounts((prev) => ({ ...prev, ...r.counts }))
    })
    return () => {
      active = false
    }
  }, [])

  const toggle = (key: string) => {
    setActiveKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <footer className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[110px] w-[1600px] max-w-full -translate-x-1/2">
      {/* 长条底图 */}
      <img src={bottomBg} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />

      <div className="pointer-events-auto relative flex h-full items-center justify-center gap-8">
        {screenLayers.map((layer) => {
          const active = activeKeys.has(layer.key)
          return (
            <button
              key={layer.key}
              onClick={() => toggle(layer.key)}
              className="group relative flex w-[130px] flex-col items-center"
              aria-pressed={active}
            >
              {/* 立体图标悬浮在底框上方 */}
              <img
                src={layer.icon}
                alt=""
                className={`relative z-10 -mb-3.5 h-[52px] w-[52px] transition-all duration-200 group-hover:scale-110 ${
                  active ? '' : 'opacity-35 grayscale'
                }`}
                aria-hidden
              />
              {/* 底框 + 文字 + 数量徽标 */}
              <div className="relative flex h-[36px] w-[128px] items-center justify-center pt-2.5">
                <img
                  src={frameImg}
                  alt=""
                  className={`absolute inset-0 h-full w-full transition-opacity ${active ? '' : 'opacity-40'}`}
                  aria-hidden
                />
                <span
                  className={`relative text-xs leading-none transition-colors ${
                    active ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {layer.label}
                </span>
                <span className="relative ml-1 rounded-[3px] border border-info/40 bg-info/20 px-1 py-px text-[10px] leading-none text-info">
                  {String(counts[layer.key] ?? 0).padStart(2, '0')}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </footer>
  )
}
