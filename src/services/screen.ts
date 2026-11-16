/**
 * 指挥大屏数据服务（数据源与 szafSystem 同源：KESI 项目 cnpadv）
 * - 预警列表 ← WarningTask（反无告警）
 * - 异常风险信息 ← AlarmRecords（反无）+ CameraEventRecord（CCTV）
 * - 底部图层计数 ← 各业务表 fetchCount 求和
 * 全部失败或空表时回退 src/data/screen.ts 演示数据。
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- KESI 原始行解析层，字段弱类型按 any 透传 */
import {
  alertMocks,
  riskMocks,
  type AlertLevel,
  type RiskGrade,
  type ScreenAlert,
  type ScreenRisk,
} from '@/data/screen'
import { fetchCount, fetchRows, fmtTime, KESI_TABLES } from './kesi'

export type DataSource = 'backend' | 'mock'

/** 罗马数字/数字等级名 → 1-4（如 "Ⅱ级"/"II级"/"2级"，同 szafSystem dashboard） */
function levelNumOf(name: string): number {
  const m = name.match(/[ⅠⅡⅢⅣ]|I{1,3}V?|[1-4]/)
  const s = m?.[0] ?? ''
  if (s === 'Ⅰ' || s === 'I' || s === '1') return 1
  if (s === 'Ⅱ' || s === 'II' || s === '2') return 2
  if (s === 'Ⅲ' || s === 'III' || s === '3') return 3
  if (s === 'Ⅳ' || s === 'IV' || s === '4') return 4
  return 0
}

const NUM_TO_LEVEL: Record<number, AlertLevel> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

function toAlertLevel(n: number): AlertLevel {
  return NUM_TO_LEVEL[n] ?? 'II'
}

/** 入侵等级数字 → 高/中/低（1=低, 2=中, 3+=高，同 szafSystem risk） */
function gradeOf(alarmLevel: unknown): RiskGrade {
  const n = Number(alarmLevel)
  if (n >= 3) return '高'
  if (n === 2) return '中'
  return '低'
}

/** 平台/站点名（platformKey 原样，空值兜底） */
function siteName(v: unknown): string {
  const s = String(v ?? '').trim()
  return s || '场站周边防护区'
}

/** 预警列表：WarningTask 反无告警（实测 2 条；无等级字段，按 warnType 名称解析） */
export async function fetchScreenWarnings(): Promise<{ items: ScreenAlert[]; source: DataSource }> {
  const rows = await fetchRows(
    KESI_TABLES.warningTask,
    { limit: 10, order: { warnDate: 'DESC' } },
    10,
  )
  if (!rows.length) return { items: alertMocks, source: 'mock' }
  return {
    items: rows.map((raw: any) => {
      const warnTypeName = String(raw.warnType?.name ?? raw.warnType ?? '')
      const level = toAlertLevel(levelNumOf(warnTypeName) || 2) // 解析不到默认 II 级
      return {
        id: String(raw.id ?? ''),
        title: String(raw.description ?? '反无告警'),
        level,
        time: fmtTime(raw.warnDate),
        area: siteName(raw.platformKey),
        people: '值班安保组',
      }
    }),
    source: 'backend',
  }
}

/** 异常风险信息（待处理）：AlarmRecords（反无）+ CameraEventRecord（CCTV）按时间倒序混合 */
export async function fetchScreenRisks(): Promise<{ items: ScreenRisk[]; source: DataSource }> {
  const [alarmRows, cameraRows] = await Promise.all([
    fetchRows(KESI_TABLES.alarmRecords, { limit: 10, order: { StartTime: 'DESC' } }, 10),
    fetchRows(KESI_TABLES.cameraEvent, { limit: 5, order: { Tsp: 'DESC' } }, 5),
  ])
  if (!alarmRows.length && !cameraRows.length) return { items: riskMocks, source: 'mock' }

  const items: ScreenRisk[] = [
    // 反无：无人机入侵记录（字段同 szafSystem dashboard.fetchRisks）
    ...alarmRows.map((raw: any): ScreenRisk => ({
      id: String(raw.id ?? ''),
      title: `${raw.uav_name ?? '未知无人机'} 入侵（${raw.uav_model ?? '型号未知'}）`,
      type: '反无',
      grade: gradeOf(raw.AlarmLevel),
      time: fmtTime(raw.StartFrom ?? raw.StartTime),
      device: String(raw.Uavid ?? '—'),
    })),
    // CCTV：摄像头事件（明细字段无解析先例，弱解析兜底，拉不到就不出条目）
    ...cameraRows.flatMap((raw: any): ScreenRisk[] => {
      const title = String(raw.name ?? raw.desc ?? raw.EventType ?? '').trim()
      if (!title) return []
      return [{
        id: String(raw.id ?? ''),
        title,
        type: 'CCTV',
        grade: gradeOf(raw.AlarmLevel ?? raw.level),
        time: fmtTime(raw.Tsp ?? raw.StartTime),
        device: String(raw.DeviceName?.name ?? raw.DeviceName ?? raw.CameraName ?? '—'),
      }]
    }),
  ]
  // 时间倒序
  items.sort((a, b) => (a.time < b.time ? 1 : -1))
  return { items, source: 'backend' }
}

/**
 * 底部图层计数（真实总数，语义映射同 szafSystem DATA-SOURCES.md）：
 * 地理营区 = campsite + camps + basecamp；物防设施 = electronicfence；
 * 感知设备 = device_manage + cameraPosition + camera + ground_station；
 * 人车动态 = detect_history；风险保障 = AlarmRecords + WarningTask；路线设施 = a_class_uav_airline。
 * 全部查询失败时返回 mock（count 沿用演示值）。
 */
export async function fetchLayerCounts(): Promise<{
  counts: Record<string, number>
  source: DataSource
}> {
  const [
    camp, camps, base, fence, antiNo, camPos, cam, gs, detect, alarm, warn, airline,
  ] = await Promise.all([
    fetchCount(KESI_TABLES.campsite),
    fetchCount(KESI_TABLES.camps),
    fetchCount(KESI_TABLES.basecamp),
    fetchCount(KESI_TABLES.electronicFence),
    fetchCount(KESI_TABLES.deviceManage),
    fetchCount(KESI_TABLES.cameraPosition),
    fetchCount(KESI_TABLES.cameraDevice),
    fetchCount(KESI_TABLES.groundStation),
    fetchCount(KESI_TABLES.detectHistory),
    fetchCount(KESI_TABLES.alarmRecords),
    fetchCount(KESI_TABLES.warningTask),
    fetchCount(KESI_TABLES.aClassUavAirline),
  ])

  const sum = (...nums: number[]) => nums.reduce((acc, n) => acc + Math.max(n, 0), 0)
  const allFailed = [camp, camps, base, fence, antiNo, camPos, cam, gs, detect, alarm, warn, airline]
    .every((n) => n < 0)
  if (allFailed) return { counts: {}, source: 'mock' }

  return {
    counts: {
      geo: sum(camp, camps, base),
      physical: sum(fence),
      sensor: sum(antiNo, camPos, cam, gs),
      traffic: sum(detect),
      risk: sum(alarm, warn),
      route: sum(airline),
    },
    source: 'backend',
  }
}
