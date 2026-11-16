import { useState } from 'react'
import compassRing from '@/images/底圈@2x.png'
import homeIcon from '@/images/icon-回到原位@2x.png'
import zoomInIcon from '@/images/icon-放大@2x.png'
import zoomOutIcon from '@/images/icon-缩小@2x.png'

/**
 * 指南针 + 缩放 + 矢量/影像底图切换（左下角悬浮）
 */
export function MapControls() {
  const [basemap, setBasemap] = useState<'vector' | 'image'>('image')

  return (
    <div className="absolute bottom-8 left-[150px] z-30 flex flex-col items-center gap-2">
      <div className="flex items-end gap-2">
        {/* 指南针 */}
        <div className="relative h-[200px] w-[200px]">
          <img src={compassRing} alt="" className="absolute inset-0 h-full w-full" aria-hidden />
          <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground">N</span>
          <span className="absolute right-4 bottom-1/2 translate-y-1/2 text-[11px] text-muted-foreground">E</span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground">S</span>
          <span className="absolute left-4 bottom-1/2 translate-y-1/2 text-[11px] text-muted-foreground">W</span>
          <button
            className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-110"
            aria-label="回到原位"
          >
            <img src={homeIcon} alt="" className="h-14 w-14" aria-hidden />
          </button>
        </div>

        {/* 缩放 */}
        <div className="flex flex-col gap-1.5 pb-5">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg transition-transform hover:scale-110"
            aria-label="放大"
          >
            <img src={zoomInIcon} alt="" className="h-11 w-11" aria-hidden />
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg transition-transform hover:scale-110"
            aria-label="缩小"
          >
            <img src={zoomOutIcon} alt="" className="h-11 w-11" aria-hidden />
          </button>
        </div>
      </div>

      {/* 矢量 / 影像 */}
      <div className="flex overflow-hidden rounded-full border border-border bg-panel-strong/80 backdrop-blur-md">
        {(
          [
            { key: 'vector', label: '矢量' },
            { key: 'image', label: '影像' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setBasemap(opt.key)}
            className={`px-4 py-1 text-xs transition-colors ${
              basemap === opt.key
                ? 'bg-primary/25 font-medium text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
