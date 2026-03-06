import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// excel module page
const ExcelRoute = {
    path: '/excel',
    name: 'Excel',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: 'Excel',
        icon: 'excel',
        orderNo: 10
    },
    children: [
        {
            path: 'export-excel',
            name: 'ExportExcel',
            element: LazyLoad(lazy(() => import('@/views/excel/export-excel'))),
            meta: {
                title: '导出Excel',
                key: 'exportExcel'
            }
        },
        {
            path: 'import-excel',
            name: 'ImportExcel',
            element: LazyLoad(lazy(() => import('@/views/excel/import-excel'))),
            meta: {
                title: '导入Excel',
                key: 'importExcel'
            }
        }
    ]
};
export default ExcelRoute;
