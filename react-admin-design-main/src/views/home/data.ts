import type { EChartsOption } from 'echarts'
import type {
  DashboardCustomerRanking,
  DashboardHomeData,
  DashboardMaterialTypeShare,
  DashboardMonthlyTrend,
  DashboardSteelTypeRanking
} from '@/modules/dashboard/api'

const chartColors = ['#1677ff', '#f97316', '#f59e0b', '#14b8a6', '#8b5cf6', '#22c55e']

export const emptyDashboardData: DashboardHomeData = {
  summary: {
    orderCount: 0,
    customerCount: 0,
    itemCount: 0,
    totalWeight: 0,
    totalMoney: 0
  },
  monthlyTrend: [],
  customerRanking: [],
  materialTypeShare: [],
  steelTypeRanking: [],
  recentOrders: []
}

export function buildCountUpData(data: DashboardHomeData) {
  const { summary } = data

  return [
    {
      title: '有效订单数',
      icon: 'document',
      count: summary.orderCount || 0,
      color: '#1677ff'
    },
    {
      title: '客户数',
      icon: 'person',
      count: summary.customerCount || 0,
      color: '#f97316'
    },
    {
      title: '材料明细数',
      icon: 'table',
      count: summary.itemCount || 0,
      color: '#f59e0b'
    },
    {
      title: '材料总重量(kg)',
      icon: 'hints',
      count: summary.totalWeight || 0,
      decimals: 2,
      color: '#14b8a6'
    },
    {
      title: '订单总金额(元)',
      icon: 'excel',
      count: summary.totalMoney || 0,
      decimals: 2,
      color: '#8b5cf6'
    }
  ]
}

export function buildMonthlyTrendOptions(monthlyTrend: DashboardMonthlyTrend[]): EChartsOption {
  return {
    title: {
      text: '月度订单趋势',
      left: 0,
      top: 0,
      textStyle: {
        fontSize: 15,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 0,
      right: 0
    },
    grid: {
      left: 0,
      right: '1%',
      top: 48,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: monthlyTrend.map(item => item.month),
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '金额'
      },
      {
        type: 'value',
        name: '单数'
      }
    ],
    series: [
      {
        name: '订单金额',
        type: 'bar',
        barWidth: '36%',
        color: '#1677ff',
        data: monthlyTrend.map(item => item.totalMoney || 0)
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        color: '#f97316',
        data: monthlyTrend.map(item => item.orderCount || 0)
      }
    ]
  }
}

export function buildCustomerRankingOptions(customerRanking: DashboardCustomerRanking[]): EChartsOption {
  return {
    title: {
      text: '客户贡献排行',
      left: 0,
      top: 0,
      textStyle: {
        fontSize: 15,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 0,
      right: '1%',
      top: 42,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: customerRanking.map(item => item.customerName)
    },
    yAxis: {
      type: 'value',
      name: '金额'
    },
    series: [
      {
        type: 'bar',
        name: '订单金额',
        color: '#14b8a6',
        data: customerRanking.map(item => ({
          name: item.customerName,
          value: item.totalMoney || 0,
          customerId: item.customerId
        }))
      }
    ]
  }
}

export function buildMaterialTypeOptions(materialTypeShare: DashboardMaterialTypeShare[]): EChartsOption {
  return {
    title: {
      text: '材料类型占比',
      left: 0,
      top: 0,
      textStyle: {
        fontSize: 15,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [
      {
        name: '材料金额',
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['50%', '48%'],
        color: chartColors,
        data: materialTypeShare.map(item => ({
          name: item.materialType,
          value: item.steelMoney || 0,
          materialType: item.materialType
        }))
      }
    ]
  }
}

export function buildSteelTypeRankingOptions(steelTypeRanking: DashboardSteelTypeRanking[]): EChartsOption {
  const ranking = [...steelTypeRanking].reverse()

  return {
    title: {
      text: '钢号金额排行',
      left: 0,
      top: 0,
      textStyle: {
        fontSize: 15,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 0,
      right: '1%',
      top: 42,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '金额'
    },
    yAxis: {
      type: 'category',
      data: ranking.map(item => item.steelType)
    },
    series: [
      {
        type: 'bar',
        name: '材料金额',
        color: '#8b5cf6',
        data: ranking.map(item => ({
          name: item.steelType,
          value: item.steelMoney || 0,
          steelType: item.steelType
        }))
      }
    ]
  }
}
