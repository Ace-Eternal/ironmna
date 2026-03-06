import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from 'antd';
import { PageWrapper } from '@/components/Page';
import { FLOW_EDITOR_PLUGIN } from '@/settings/websiteSetting';
import { Approve } from '@/components/LogicFlow';
const FlowApprove = () => {
    return (_jsx(PageWrapper, { plugin: FLOW_EDITOR_PLUGIN, children: _jsx(Card, { bordered: false, children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '500px' }, children: _jsx(Approve, {}) }) }) }));
};
export default FlowApprove;
