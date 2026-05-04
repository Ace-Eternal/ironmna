import { httpClient } from '@/shared/api/httpClient'

export interface DashboardSummary {
  orderCount: number
  customerCount: number
  itemCount: number
  totalWeight: number
  totalMoney: number
}

export interface DashboardMonthlyTrend {
  month: string
  orderCount: number
  totalMoney: number
}

export interface DashboardCustomerRanking {
  customerId: number
  customerName: string
  orderCount: number
  totalMoney: number
}

export interface DashboardMaterialTypeShare {
  materialType: string
  itemCount: number
  amount: number
  totalWeight: number
  steelMoney: number
}

export interface DashboardSteelTypeRanking {
  steelType: string
  itemCount: number
  amount: number
  totalWeight: number
  steelMoney: number
}

export interface DashboardRecentOrder {
  orderId: number
  customerName: string
  orderDate: string
  totalMoney: number
  processFee: number
  itemCount: number
  totalWeight: number
}

export interface DashboardHomeData {
  summary: DashboardSummary
  monthlyTrend: DashboardMonthlyTrend[]
  customerRanking: DashboardCustomerRanking[]
  materialTypeShare: DashboardMaterialTypeShare[]
  steelTypeRanking: DashboardSteelTypeRanking[]
  recentOrders: DashboardRecentOrder[]
}

export function getDashboardHome() {
  return httpClient({
    url: '/dashboard/home',
    method: 'get'
  }) as unknown as Promise<DashboardHomeData>
}
