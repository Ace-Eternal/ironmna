import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Form, Radio, Switch } from 'antd';
import { PageWrapper } from '@/components/Page';
import { React_TREE_ORG_PLUGIN } from '@/settings/websiteSetting';
import OrgTree from 'react-org-tree';
import { data } from './data';
const OrgTreePage = () => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState({
        horizontal: false,
        expandAll: true
    });
    const onValuesChange = (values) => {
        setConfig({ ...config, ...values });
    };
    return (_jsx(PageWrapper, { plugin: React_TREE_ORG_PLUGIN, children: _jsxs(Card, { bordered: false, bodyStyle: { minHeight: '400px' }, children: [_jsxs(Form, { form: form, initialValues: { ...config }, layout: 'inline', labelAlign: 'left', onValuesChange: onValuesChange, children: [_jsx(Form.Item, { label: '\u6392\u5217\u65B9\u5F0F\uFF1A', name: 'horizontal', children: _jsxs(Radio.Group, { optionType: 'button', buttonStyle: 'solid', children: [_jsx(Radio.Button, { value: true, children: "\u6C34\u5E73" }), _jsx(Radio.Button, { value: false, children: "\u5782\u76F4" })] }) }), _jsx(Form.Item, { label: '\u5C55\u5F00\u5168\u90E8\uFF1A', name: 'expandAll', valuePropName: 'checked', children: _jsx(Switch, {}) })] }), _jsx("div", { style: { textAlign: 'center' }, children: _jsx(OrgTree, { data: data, collapsable: true, horizontal: config.horizontal, expandAll: config.expandAll }) })] }) }));
};
export default OrgTreePage;
