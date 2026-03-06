import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Select, Input, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { approveUser } from '../config';
// @ts-ignore
export default function PropertyPanel(nodeData, updateproperty, hidePropertyPanel) {
    const getApproveList = () => {
        const approveUserOption = [];
        approveUser.forEach((item) => {
            approveUserOption.push(_jsx(Select.Option, { value: item.value, children: item.label }));
        });
        const approveSelect = (_jsx(Form.Item, { className: 'form-property', label: '\u5BA1\u6838\u8282\u70B9\u7C7B\u578B', name: 'approveType', children: _jsx(Select, { children: approveUserOption }) }));
        return approveSelect;
    };
    const getApiUrl = () => {
        const Api = (_jsx(Form.Item, { label: 'API', name: 'api', children: _jsx(Input, {}) }));
        return Api;
    };
    const onFormLayoutChange = (value, _all) => {
        approveUser.forEach(item => {
            if (item.value === value.approveType) {
                value['approveTypeLabel'] = item.label;
            }
        });
        updateproperty(nodeData.id, value);
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "\u5C5E\u6027\u9762\u677F" }), _jsxs(Form, { initialValues: nodeData.properties, onValuesChange: onFormLayoutChange, children: [_jsxs("span", { className: 'form-property', children: ["\u7C7B\u578B\uFF1A", _jsx("span", { children: nodeData.type })] }), _jsxs("span", { className: 'form-property', children: ["\u6587\u6848\uFF1A", _jsx("span", { children: nodeData.text?.value })] }), nodeData.type === 'approver' ? getApproveList() : '', nodeData.type === 'jugement' ? getApiUrl() : ''] }, nodeData.id), _jsxs("div", { children: [_jsx("h3", { children: "......" }), _jsx("h3", { children: "\u4E1A\u52A1\u5C5E\u6027\u53EF\u6839\u636E\u9700\u8981\u8FDB\u884C\u81EA\u5B9A\u4E49\u6269\u5C55" })] }), _jsx("div", { className: 'property-panel-footer', children: _jsx(Button, { className: 'property-panel-footer-hide', type: 'primary', icon: _jsx(DownOutlined, {}), onClick: hidePropertyPanel, children: "\u6536\u8D77" }) })] }));
}
