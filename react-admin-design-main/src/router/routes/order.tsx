import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// table module page
const OrderRoute: RouteObject = {
  path: '/order',
  name: 'order',
  element: <LayoutGuard />,
  meta: {
    title: '账单',
    icon: 'table',
    orderNo: 12
  },
  children: [
    {
      path: 'order-basic',
      name: 'OrderBasic',
      element: LazyLoad(lazy(() => import('@/views/order/order-basic'))),
      meta: {
        title: '账单列表',
        key: 'tableBasic'
      }
    },
    {
      path: 'order-addition',
      name: 'OrderAddition',
      element: LazyLoad(lazy(() => import('@/views/order/order-addition'))),
      meta: {
        title: '添加账单',
        key: 'tableEditRow'
      }
    },
    {
      path: 'order-detail',
      name: 'OrderDetail',
      element: LazyLoad(lazy(() => import('@/views/order/order-detail'))),
      meta: {
        title: '账单详情',
        key: 'childTable'
      }
    }
  ]
}

export default OrderRoute
