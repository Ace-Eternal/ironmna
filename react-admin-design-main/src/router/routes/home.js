import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// Home route
const HomeRoute = {
    path: '/home',
    name: 'Home',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: '首页',
        icon: 'home',
        affix: true,
        orderNo: 1,
        hideChildrenInMenu: true
    },
    children: [
        {
            path: '',
            name: 'HomePage',
            element: LazyLoad(lazy(() => import('@/views/home'))),
            meta: {
                title: '首页',
                key: 'home',
                icon: 'home',
                orderNo: 1,
                hideMenu: true
            }
        }
    ]
};
export default HomeRoute;
