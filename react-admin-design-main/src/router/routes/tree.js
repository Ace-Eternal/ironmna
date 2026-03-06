import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// tree module page
const TreeRoute = {
    path: '/tree',
    name: 'Tree',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: '树形结构',
        icon: 'tree',
        orderNo: 9
    },
    children: [
        {
            path: 'org-tree',
            name: 'OrgTree',
            element: LazyLoad(lazy(() => import('@/views/tree/org-tree'))),
            meta: {
                title: '组织树',
                key: 'orgTree'
            }
        },
        {
            path: 'antd-tree',
            name: 'AntdTree',
            element: LazyLoad(lazy(() => import('@/views/tree/antd-tree'))),
            meta: {
                title: '控件树',
                key: 'antdTree'
            }
        }
    ]
};
export default TreeRoute;
