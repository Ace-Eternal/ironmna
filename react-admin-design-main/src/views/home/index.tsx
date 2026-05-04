import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Row, Col, Space, Card, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import CountUpCard from './components/CountUpCard'
import ChartsCard from './components/ChartsCard'
import { getDashboardHome } from '@/api'
import type { DashboardHomeData, DashboardRecentOrder } from '@/modules/dashboard/api'
import {
  buildCountUpData,
  buildCustomerRankingOptions,
  buildMaterialTypeOptions,
  buildMonthlyTrendOptions,
  buildSteelTypeRankingOptions,
  emptyDashboardData
} from './data'

const HomePage: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardHomeData>(emptyDashboardData)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setIsLoading(true)
    try {
      const data = await getDashboardHome()
      setDashboardData(data)
    } catch (error) {
      message.error('首页经营数据加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  const countUpData = useMemo(() => buildCountUpData(dashboardData), [dashboardData])
  const monthlyTrendOptions = useMemo(() => buildMonthlyTrendOptions(dashboardData.monthlyTrend), [dashboardData])
  const customerRankingOptions = useMemo(() => buildCustomerRankingOptions(dashboardData.customerRanking), [dashboardData])
  const materialTypeOptions = useMemo(() => buildMaterialTypeOptions(dashboardData.materialTypeShare), [dashboardData])
  const steelTypeRankingOptions = useMemo(() => buildSteelTypeRankingOptions(dashboardData.steelTypeRanking), [dashboardData])

  const recentOrderColumns: ColumnsType<DashboardRecentOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      align: 'center'
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      align: 'center'
    },
    {
      title: '下单日期',
      dataIndex: 'orderDate',
      align: 'center'
    },
    {
      title: '订单金额(元)',
      dataIndex: 'totalMoney',
      align: 'center',
      render: (value: number) => formatNumber(value)
    },
    {
      title: '加工费(元)',
      dataIndex: 'processFee',
      align: 'center',
      render: (value: number) => formatNumber(value)
    },
    {
      title: '材料条数',
      dataIndex: 'itemCount',
      align: 'center'
    },
    {
      title: '总重量(kg)',
      dataIndex: 'totalWeight',
      align: 'center',
      render: (value: number) => formatNumber(value)
    }
  ]

  const goOrderList = useCallback(
    (query: Record<string, string | number | undefined>) => {
      const searchParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, String(value))
        }
      })
      navigate(`/order/order-basic?${searchParams.toString()}`)
    },
    [navigate]
  )

  const handleMonthlyTrendClick = useCallback(
    (params: any) => {
      goOrderList({ month: params.name })
    },
    [goOrderList]
  )

  const handleCustomerRankingClick = useCallback(
    (params: any) => {
      goOrderList({ customerId: params.data?.customerId })
    },
    [goOrderList]
  )

  const handleMaterialTypeClick = useCallback(
    (params: any) => {
      goOrderList({ materialType: params.data?.materialType || params.name })
    },
    [goOrderList]
  )

  const handleSteelTypeClick = useCallback(
    (params: any) => {
      goOrderList({ steelType: params.data?.steelType || params.name })
    },
    [goOrderList]
  )

  return (
    <Space direction='vertical' size={12} style={{ display: 'flex' }}>
      <Row gutter={12}>
        {countUpData.map(item => {
          return (
            <Col flex={1} key={item.title}>
              <CountUpCard
                loading={isLoading}
                title={item.title}
                color={item.color}
                iconName={item.icon}
                countNum={item.count}
                decimals={item.decimals}
              />
            </Col>
          )
        })}
      </Row>
      <Row gutter={12}>
        <Col xs={24} lg={16}>
          <ChartsCard loading={isLoading} options={monthlyTrendOptions} height={320} onChartClick={handleMonthlyTrendClick} />
        </Col>
        <Col xs={24} lg={8}>
          <ChartsCard loading={isLoading} options={materialTypeOptions} height={320} onChartClick={handleMaterialTypeClick} />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col xs={24} lg={12}>
          <ChartsCard loading={isLoading} options={customerRankingOptions} height={350} onChartClick={handleCustomerRankingClick} />
        </Col>
        <Col xs={24} lg={12}>
          <ChartsCard loading={isLoading} options={steelTypeRankingOptions} height={350} onChartClick={handleSteelTypeClick} />
        </Col>
      </Row>
      <Card bordered={false} title='最近订单' loading={isLoading}>
        <Table
          rowKey='orderId'
          columns={recentOrderColumns}
          dataSource={dashboardData.recentOrders}
          pagination={false}
          size='middle'
        />
      </Card>
    </Space>
  )
}

function formatNumber(value: number) {
  return Number(value || 0).toFixed(2)
}

export default HomePage
