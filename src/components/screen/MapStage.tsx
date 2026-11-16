import { mapMarkers } from '@/data/screen'
import mapBg from '@/images/地图-反无.jpg.png'
import droneIcon from '@/images/icon-无人机@2x.png'
import riskIcon from '@/images/icon-风险点@2x.png'
import scaleImg from '@/images/刻度@2x.png'

/**
 * 全屏地图舞台：卫星影像底图（青色营区多边形已烘焙在图内）
 * + 红色风险点 / 无人机标记叠加（带呼吸光圈）
 */
export function MapStage() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img src={mapBg} alt="全域态势地图" className="h-full w-full object-cover" />

      {/* 四边暗角遮罩（边缘深色 → 内部透明） */}
      <div className="edge-shade-top pointer-events-none absolute inset-x-0 top-0 h-[190px]" aria-hidden />
      <div className="edge-shade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[240px]" aria-hidden />
      <div className="edge-shade-left pointer-events-none absolute inset-y-0 left-0 w-[190px]" aria-hidden />
      <div className="edge-shade-right pointer-events-none absolute inset-y-0 right-0 w-[580px]" aria-hidden />

      {/* 扫描线装饰 */}
      <div className="absolute inset-x-0 top-[15%] h-px bg-screen-line" aria-hidden />
      <div className="absolute inset-y-0 left-[10%] w-px bg-screen-line/60" aria-hidden />

      {/* 左缘刻度尺 */}
      <img
        src={scaleImg}
        alt=""
        className="absolute top-1/2 left-0 h-[72%] w-auto -translate-y-1/2 opacity-60"
        aria-hidden
      />

      {/* 标记 */}
      {mapMarkers.map((marker) => (
        <div
          key={marker.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.kind === 'risk' ? (
            <div className="relative flex items-center justify-center">
              <span className="animate-ping-soft absolute h-10 w-10 rounded-full bg-destructive/25" aria-hidden />
              <img src={riskIcon} alt="风险点" className="relative h-[46px] w-[38px] drop-shadow-[0_0_8px_var(--destructive)]" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="animate-ping-soft absolute h-14 w-14 rounded-full border-2 border-primary/60 bg-primary/10" aria-hidden />
              <img src={droneIcon} alt="无人机" className="relative h-14 w-14 drop-shadow-[0_0_10px_var(--primary)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
