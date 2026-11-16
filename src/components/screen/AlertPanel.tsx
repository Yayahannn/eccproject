import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { alertMocks, riskMocks, type AlertLevel, type RiskGrade, type ScreenAlert, type ScreenRisk } from '@/data/screen'
import { fetchScreenRisks, fetchScreenWarnings } from '@/services/screen'
import dropIcon from '@/images/下拉@2x.png'
import collapseIcon from '@/images/icon-收起@2x.png'
import panelTitleBg from '@/images/大标题-@2x.png'

/* 等级徽章样式映射（token 类名，禁止硬编码色值） */
const levelBadge: Record<AlertLevel, string> = {
  I: 'border-level-1/40 bg-level-1/15 text-level-1',
  II: 'border-level-2/40 bg-level-2/15 text-level-2',
  III: 'border-level-3/40 bg-level-3/15 text-level-3',
  IV: 'border-level-4/40 bg-level-4/15 text-level-4',
}

const gradeBadge: Record<RiskGrade, string> = {
  高: 'border-level-1/40 bg-level-1/15 text-level-1',
  中: 'border-level-2/40 bg-level-2/15 text-level-2',
  低: 'border-level-4/40 bg-level-4/15 text-level-4',
}

/* 信息点发光色映射（blur 光晕，样式见 index.css .glow-dot-*） */
const levelDot: Record<AlertLevel, string> = {
  I: 'glow-dot-red',
  II: 'glow-dot-orange',
  III: 'glow-dot-yellow',
  IV: 'glow-dot-cyan',
}

const levelDotCore: Record<AlertLevel, string> = {
  I: 'dot-core-red',
  II: 'dot-core-orange',
  III: 'dot-core-yellow',
  IV: 'dot-core-cyan',
}

const gradeDot: Record<RiskGrade, string> = {
  高: 'glow-dot-red',
  中: 'glow-dot-orange',
  低: 'glow-dot-yellow',
}

const gradeDotCore: Record<RiskGrade, string> = {
  高: 'dot-core-red',
  中: 'dot-core-orange',
  低: 'dot-core-yellow',
}

function PanelHeader({ title, extra }: { title: string; extra?: React.ReactNode }) {
  return (
    <div className="relative flex h-10 shrink-0 items-center justify-between px-4">
      {/* 标题条切图背景（大标题-.png，拉伸铺满） */}
      <img src={panelTitleBg} alt="" className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative flex items-center gap-2">
        <span className="h-3.5 w-[3px] rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" aria-hidden />
        <h2 className="text-[15px] font-semibold tracking-wide">{title}</h2>
      </div>
      {extra && <div className="relative">{extra}</div>}
    </div>
  )
}

export function AlertPanel() {
  const [collapsed, setCollapsed] = useState(false)
  // 初始即演示数据（不白屏），KESI 到达后替换
  const [alerts, setAlerts] = useState<ScreenAlert[]>(alertMocks)
  const [risks, setRisks] = useState<ScreenRisk[]>(riskMocks)

  useEffect(() => {
    let active = true
    fetchScreenWarnings().then((r) => active && setAlerts(r.items))
    fetchScreenRisks().then((r) => active && setRisks(r.items))
    return () => {
      active = false
    }
  }, [])

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-1/2 right-2 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-panel-strong/90 backdrop-blur-md transition-transform hover:scale-110"
        aria-label="展开预警面板"
      >
        <img src={collapseIcon} alt="" className="h-8 w-8 -rotate-90" aria-hidden />
      </button>
    )
  }

  return (
    <section className="absolute top-[90px] right-4 bottom-[130px] z-30 flex w-[400px] flex-col gap-3">
      {/* ————— 预警列表（标题条与条目各自带左深右透渐变底，无整块面板背景） ————— */}
      <div className="flex min-h-0 flex-[3] flex-col overflow-hidden">
        <PanelHeader
          title="预警列表"
          extra={
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent/60"
              aria-label="收起面板"
            >
              <img src={collapseIcon} alt="" className="h-6 w-6" aria-hidden />
            </button>
          }
        />
        <ScrollArea className="min-h-0 flex-1">
          <div>
            {alerts.map((alert) => (
              <article key={alert.id} className="border-b border-border/40 px-4 py-3">
                <div className="relative flex items-start justify-between gap-3">
                  {/* 标题行渐变底（青色中亮两端透明） */}
                  <span className="item-title-gradient pointer-events-none absolute inset-x-[-16px] inset-y-[-2px]" aria-hidden />
                  <h3 className="relative flex items-start gap-2 text-sm leading-5 font-medium">
                    {/* 双层信息点：外 blur 光晕 + 中心小实心圆心 */}
                    <span className="relative mt-[3px] h-2.5 w-2.5 shrink-0" aria-hidden>
                      <span className={`glow-dot absolute inset-0 ${levelDot[alert.level]}`} />
                      <span className={`dot-core absolute top-1/2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ${levelDotCore[alert.level]}`} />
                    </span>
                    {alert.title}
                  </h3>
                  <span className={`relative shrink-0 rounded border px-1.5 py-0.5 text-[11px] leading-none ${levelBadge[alert.level]}`}>
                    {alert.level}级
                  </span>
                </div>
                <dl className="mt-1.5 space-y-0.5 text-xs leading-5 text-foreground/85">
                  <div className="flex gap-1">
                    <dt className="shrink-0">预警时间：</dt>
                    <dd>{alert.time}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="shrink-0">涉及区域：</dt>
                    <dd>{alert.area}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="shrink-0">涉及人员：</dt>
                    <dd>{alert.people}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ————— 异常风险信息（待处理） ————— */}
      <div className="flex min-h-0 flex-[2] flex-col overflow-hidden">
        <PanelHeader
          title="异常风险信息（待处理）"
          extra={
            <button className="flex items-center gap-1 text-xs text-foreground/85 hover:text-foreground">
              全部
              <img src={dropIcon} alt="" className="h-2.5 w-3.5" aria-hidden />
            </button>
          }
        />
        <ScrollArea className="min-h-0 flex-1">
          <div>
            {risks.map((risk) => (
              <article key={risk.id} className="border-b border-border/40 px-4 py-3">
                <div className="relative flex items-start justify-between gap-2">
                  {/* 标题行渐变底（青色中亮两端透明） */}
                  <span className="item-title-gradient pointer-events-none absolute inset-x-[-16px] inset-y-[-2px]" aria-hidden />
                  <h3 className="relative flex items-start gap-2 text-sm leading-5 font-medium">
                    {/* 双层信息点：外 blur 光晕 + 中心小实心圆心 */}
                    <span className="relative mt-[3px] h-2.5 w-2.5 shrink-0" aria-hidden>
                      <span className={`glow-dot absolute inset-0 ${gradeDot[risk.grade]}`} />
                      <span className={`dot-core absolute top-1/2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ${gradeDotCore[risk.grade]}`} />
                    </span>
                    {risk.title}
                  </h3>
                  <span className="relative flex shrink-0 items-center gap-1.5">
                    <span className="rounded border border-info/40 bg-info/15 px-1.5 py-0.5 text-[11px] leading-none text-info">
                      {risk.type}
                    </span>
                    <span className={`rounded border px-1.5 py-0.5 text-[11px] leading-none ${gradeBadge[risk.grade]}`}>
                      {risk.grade}
                    </span>
                  </span>
                </div>
                <dl className="mt-1.5 space-y-0.5 text-xs leading-5 text-foreground/85">
                  <div className="flex gap-1">
                    <dt className="shrink-0">预警时间：</dt>
                    <dd>{risk.time}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="shrink-0">设备名称：</dt>
                    <dd>{risk.device}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}
