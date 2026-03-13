import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';
// flow-editor module page
const FlowEditorRoute = {
    path: '/flow-editor',
    name: 'FlowEditor',
    element: _jsx(LayoutGuard, {}),
    meta: {
        title: '流程图编辑器',
        icon: 'flow',
        orderNo: 8,
        hideMenu: true
    },
    children: [
        {
            path: 'flow-approve',
            name: 'FlowApprove',
            element: LazyLoad(lazy(() => import('@/views/flow/flow-approve'))),
            meta: {
                title: '审批流程图',
                key: 'flowApprove'
            }
        },
        {
            path: 'flow-bpmn',
            name: 'FlowBpmn',
            element: LazyLoad(lazy(() => import('@/views/flow/flow-bpmn'))),
            meta: {
                title: 'BPMN流程图',
                key: 'flowBpmn'
            }
        }
    ]
};
export default FlowEditorRoute;
