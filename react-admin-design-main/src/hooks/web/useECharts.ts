import type { EChartsOption } from 'echarts'
import { useRef, useEffect } from 'react'
import { useDebounceFn } from 'ahooks'
import echarts from '@/utils/echarts'

export function useECharts(
  options: EChartsOption,
  loading: boolean = true,
  theme: 'light' | 'dark' | 'default' = 'default'
) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const { run: resizeFn } = useDebounceFn(
    () => {
      chartInstance.current?.resize()
    },
    { wait: 200 }
  )

  useEffect(() => {
    initCharts()

    return () => {
      disposeCharts()
    }
  }, [])

  useEffect(() => {
    if (loading) return
    setOptions(options)

    return () => {
      disposeCharts()
    }
  }, [loading, options])

  const initCharts = (t = theme) => {
    const el = chartRef?.current
    if (!el) return

    chartInstance.current = echarts.init(el, t)

    window.addEventListener('resize', resizeFn)
  }

  const setOptions = (options: EChartsOption) => {
    if (!chartInstance.current) {
      initCharts()

      if (!chartInstance.current) return
    }

    chartInstance.current?.clear()

    chartInstance.current?.setOption(options)
  }

  const disposeCharts = () => {
    if (!chartInstance.current) return
    window.removeEventListener('resize', resizeFn)
    chartInstance.current.dispose()
    chartInstance.current = null
  }

  const getInstance = (): echarts.ECharts | null => {
    if (!chartInstance.current) {
      initCharts()
    }
    return chartInstance.current
  }

  return { chartRef, getInstance }
}
