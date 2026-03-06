import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// table module page
const CustomerRoute = {
    path: '/customer',
    name: 'customer',
    element: _jsx(LayoutGuard, {}),
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
};
export default CustomerRoute;
