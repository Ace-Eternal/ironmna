import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// form module page
const FormRoute = {
    path: '/form',
    name: 'Form',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: '表单',
        icon: 'form',
        orderNo: 2
    },
    children: [
        {
            path: 'basic-form',
            name: 'BasicForm',
            element: LazyLoad(lazy(() => import('@/views/form/basic-form'))),
            meta: {
                title: '基础表单',
                key: 'basicForm'
            }
        },
        {
            path: 'form-designer',
            name: 'FormDesigner',
            element: LazyLoad(lazy(() => import('@/views/blank'))),
            meta: {
                title: '表单设计器',
                key: 'formDesigner'
            }
        }
    ]
};
export default FormRoute;
