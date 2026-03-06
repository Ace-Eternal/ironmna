import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// table module page
const CustomerRoute: RouteObject = {
  path: '/customer',
  name: 'customer',
  element: <LayoutGuard />,
  meta: {
    title: '客户',
    icon: 'table',
    orderNo: 12
  },
  children: [
    {
      path: 'customer-basic',
      name: 'CustomerBasic',
      element: LazyLoad(lazy(() => import('@/views/customer/customer-basic'))),
      meta: {
        title: '客户列表',
        key: 'tableBasic'
      }
    },
    {
      path: 'customer-addition',
      name: 'CustomerAddition',
      element: LazyLoad(lazy(() => import('@/views/customer/customer-addition'))),
      meta: {
        title: '添加客户',
        key: 'tableEditRow'
      }
    }
  ]
}

export default CustomerRoute
