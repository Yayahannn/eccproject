/**
 * KESI 表数据共享取数工具（大屏 service 复用）
 * 与 szafSystem/src/services/kesi.ts 同源同契约（项目 cnpadv）。
 *
 * 契约（szafSystem 2026-10-28 实测）：
 * - 业务表路由 core/t/<表id>/d；登录后 SDK 自动注入 Authorization
 * - 自定义表创建实例必须 projectAll: true，查询不传 fields（动态字段传了会静默丢失）
 * - 关联字段（relate-table-*）列表接口返回行 id 字符串，详情接口才渲染成对象
 * - 列表查询上限约 30-50 条，列表总数在 Count 响应头（SDK 转为 total）
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- KESI 原始行解析层，字段弱类型按 any 透传 */
import { createAPI } from '@kesi/client'

export const KESI_TABLES = {
  /** 反无告警（实测 2 条）——预警列表 */
  warningTask: 'core/t/WarningTask/d',
  /** 入侵记录（实测 690 条）——异常风险信息（反无来源） */
  alarmRecords: 'core/t/AlarmRecords/d',
  /** 摄像头事件记录（实测 6000 条）——异常风险信息（CCTV 来源） */
  cameraEvent: 'core/t/CameraEventRecord/d',
  /** 营地（实测 5 条）——图层「地理营区」 */
  campsite: 'core/t/campsite/d',
  /** 营地 1 级表（实测 6 条）——图层「地理营区」 */
  camps: 'core/t/camps/d',
  /** 大本营（实测 1 条）——图层「地理营区」 */
  basecamp: 'core/t/basecamp/d',
  /** 电子围栏（实测 2 条）——图层「物防设施」 */
  electronicFence: 'core/t/electronicfence/d',
  /** 反无设备管理（实测 18 条）——图层「感知设备」 */
  deviceManage: 'core/t/device_manage/d',
  /** 摄像头位置（实测 10 行）——图层「感知设备」 */
  cameraPosition: 'core/t/cameraPosition/d',
  /** 摄像头设备（实测 12 行）——图层「感知设备」 */
  cameraDevice: 'core/t/camera/d',
  /** 地面站（实测 3 条）——图层「感知设备」 */
  groundStation: 'core/t/ground_station/d',
  /** AI 侦测记录（人员/车辆，实测 46895 条）——图层「人车动态」 */
  detectHistory: 'core/t/detect_history/d',
  /** A类无人机航线（实测 8 条）——图层「路线设施」 */
  aClassUavAirline: 'core/t/a_class_uav_airline/d',
} as const

/** 请求超时（后端不可达时快速回退演示数据） */
export function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

/**
 * 取表数据：列表（filter/order/count）→ 截取前 n 条逐条拉详情
 * （关联字段需要详情接口渲染成对象，如 warnType.name）。
 * 任何失败返回 []，由调用方回退演示数据。
 */
export async function fetchRows(
  resource: string,
  params: Record<string, unknown> = {},
  n = 30,
): Promise<any[]> {
  try {
    const api = createAPI({ name: resource, resource, projectAll: true })
    const { items } = await withTimeout(api.query({ withCount: true, ...params }))
    const ids = (Array.isArray(items) ? items : [])
      .map((r: any) => String(r.id ?? ''))
      .filter(Boolean)
      .slice(0, n)
    if (!ids.length) return []
    const rows = await withTimeout(
      Promise.all(ids.map((id: string) => api.get(id).catch(() => null))),
      12000,
    )
    return rows.filter(Boolean)
  } catch (e) {
    console.debug('[kesi] fetchRows failed:', resource, (e as Error).message)
    return []
  }
}

/** 只取总数（withCount，不拉详情，轻量）。-1 表示查询失败，0 表示真无数据 */
export async function fetchCount(resource: string, filter?: Record<string, unknown>): Promise<number> {
  try {
    const api = createAPI({ name: `count-${resource}`, resource, projectAll: true })
    const res: any = await withTimeout(api.query({ limit: 1, withCount: true, ...(filter ? { filter } : {}) }))
    const total = Number(res?.total ?? 0)
    return Number.isFinite(total) ? total : 0
  } catch (e) {
    console.debug('[kesi] fetchCount failed:', resource, (e as Error).message)
    return -1
  }
}

/** ISO 时间 → 'YYYY-MM-DD HH:mm'（本地时区），解析失败原样返回 */
export function fmtTime(value: unknown): string {
  const ms = new Date(String(value ?? '')).getTime()
  if (!Number.isFinite(ms)) return String(value ?? '')
  const dt = new Date(ms)
  const pad = (v: number) => String(v).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}
