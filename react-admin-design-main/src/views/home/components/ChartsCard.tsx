import type { EChartsOption } from 'echarts'
import { type FC, useEffect } from 'react'
import { Card } from 'antd'
import { useECharts } from '@/hooks/web/useECharts'

interface propState {
  loading: boolean
  options: EChartsOption
  height: number
  onChartClick?: (params: any) => void
}

const ChartsCard: FC<propState> = ({ loading, options, height, onChartClick }) => {
  const { chartRef, getInstance } = useECharts(options, loading)

  useEffect(() => {
    if (loading || !onChartClick) return

    const chart = getInstance()
    if (!chart) return

    chart.off('click')
    chart.on('click', onChartClick)

    return () => {
      chart.off('click', onChartClick)
    }
  }, [loading, onChartClick, getInstance])

  return (
    <Card loading={loading} bordered={false}>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: height + 'px'
        }}
      />
    </Card>
  )
}

export default ChartsCard
