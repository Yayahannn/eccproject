import iconGeo from '@/images/1-地理营区 1@2x.png'
import iconPhysical from '@/images/2-物防设施@2x.png'
import iconSensor from '@/images/3-感知设备@2x.png'
import iconTraffic from '@/images/4-人车动态@2x.png'
import iconRisk from '@/images/5-风险保障@2x.png'
import iconRoute from '@/images/6-路线设施@2x.png'
import iconGlobal from '@/images/icon-全域监控@2x.png'
import iconSituation from '@/images/icon-态势监控@2x.png'
import iconDispose from '@/images/icon-风险处置@2x.png'
import iconMaintain from '@/images/icon-资源运维@2x.png'
import iconAnalysis from '@/images/icon-分析管理@2x.png'

/* ————— 预警列表（mock 回退：KESI 不可达/空表时使用） ————— */

export type AlertLevel = 'I' | 'II' | 'III' | 'IV'

export interface ScreenAlert {
  id: string
  title: string
  level: AlertLevel
  time: string
  area: string
  people: string
}

export const alertMocks: ScreenAlert[] = [
  {
    id: 'alert-dibeilla',
    title: 'Dibeilla 东南角持续无人机入侵，疑似侦察',
    level: 'II',
    time: '2026-10-15 22:10',
    area: 'Dibeilla 场站东南侧缓冲区（半径约 200m）',
    people: '张伟（巡逻队）、李强（安保组）、无人机反制组',
  },
  {
    id: 'alert-fana',
    title: 'Fana 站区西侧发现可疑武装人员越界',
    level: 'I',
    time: '2026-10-15 22:10',
    area: 'Fana W-1 西侧围栏外 800m',
    people: '王磊（应急组）、安保 3 人',
  },
  {
    id: 'alert-goumeri',
    title: 'Goumeri 油气罐区液位异常波动',
    level: 'III',
    time: '2026-10-15 22:10',
    area: 'Goumeri CPF 二号罐区',
    people: '李强（安保）、仪表组 2 人',
  },
  {
    id: 'alert-sokor',
    title: 'Sokor 站外道路出现抛撒可疑物',
    level: 'IV',
    time: '2026-10-15 22:10',
    area: 'Sokor 站外道路 K2+300',
    people: '张伟（巡逻队）',
  },
]

/* ————— 异常风险信息（mock 回退） ————— */

export type RiskGrade = '高' | '中' | '低'

export interface ScreenRisk {
  id: string
  title: string
  type: string
  grade: RiskGrade
  time: string
  device: string
}

export const riskMocks: ScreenRisk[] = [
  {
    id: 'risk-cctv',
    title: '周界北侧摄像机侦测到可疑人员徘徊',
    type: 'CCTV',
    grade: '中',
    time: '2026-10-15 22:10',
    device: 'CCTV-KL-07 周界相机',
  },
  {
    id: 'risk-fanwu',
    title: '东南角侦测到入侵无人机信号，频率异常',
    type: '反无',
    grade: '高',
    time: '2026-10-15 22:10',
    device: '反无侦测站 AN-02',
  },
  {
    id: 'risk-thermal',
    title: '热成像通道发现动物活动（牛群）',
    type: '高点',
    grade: '低',
    time: '2026-10-15 22:10',
    device: '高点热成像 HC-03',
  },
]

/* ————— 底部图层开关（icon 为本地切图；count 为 mock 回退值，真实计数走 service） ————— */

export interface ScreenLayer {
  key: string
  label: string
  count: number
  icon: string
}

export const screenLayers: ScreenLayer[] = [
  { key: 'geo', label: '地理营区', count: 15, icon: iconGeo },
  { key: 'physical', label: '物防设施', count: 10, icon: iconPhysical },
  { key: 'sensor', label: '感知设备', count: 8, icon: iconSensor },
  { key: 'traffic', label: '人车动态', count: 14, icon: iconTraffic },
  { key: 'risk', label: '风险保障', count: 4, icon: iconRisk },
  { key: 'route', label: '路线设施', count: 8, icon: iconRoute },
]

/* ————— 左侧功能菜单 ————— */

export interface ScreenMenu {
  key: string
  label: string
  icon: string
}

export const screenMenus: ScreenMenu[] = [
  { key: 'global', label: '全域监控', icon: iconGlobal },
  { key: 'situation', label: '态势监控', icon: iconSituation },
  { key: 'dispose', label: '风险处置', icon: iconDispose },
  { key: 'maintain', label: '资源运维', icon: iconMaintain },
  { key: 'analysis', label: '分析与管理', icon: iconAnalysis },
]

/* ————— 地图标记（百分比相对地图容器） ————— */

export interface MapMarker {
  id: string
  kind: 'risk' | 'drone'
  x: number
  y: number
}

export const mapMarkers: MapMarker[] = [
  { id: 'marker-1', kind: 'risk', x: 56.9, y: 20.4 },
  { id: 'marker-2', kind: 'risk', x: 32.7, y: 55.3 },
  { id: 'marker-drone', kind: 'drone', x: 29.8, y: 45.8 },
]
