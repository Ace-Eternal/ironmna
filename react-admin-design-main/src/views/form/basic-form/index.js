import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Form, Row, Col, Input, InputNumber, Button, Select, DatePicker, TimePicker, Switch, Slider, Cascader, TreeSelect, Radio, Checkbox } from 'antd';
import { FORM_COMPO } from '@/settings/websiteSetting';
import { PageWrapper } from '@/components/Page';
import { provinceData, cityData, cascaderData, treeData, radioData, checkboxData } from './data';
const BasicForm = () => {
    const [form] = Form.useForm();
    const province = provinceData[0];
    const [formState] = useState({
        inputLimit: '',
        inputNum: '',
        password: '',
        selectProvince: province,
        selectCity: cityData[province][0],
        dateVal: '',
        timeVal: '',
        switchVal: true,
        sliderVal: 32,
        cascaderVal: [],
        cascaderLazy: [],
        treeVal: ['0-0-1'],
        treeLazy: '1',
        radioVal: 'offline',
        checkboxVal: ['read'],
        textareaVal: ''
    });
    const formRules = {
        inputLimit: [{ required: true, message: '内容不能为空' }],
        inputNum: [
            { required: true, message: '内容不能为空' },
            { type: 'number', message: '内容必须为数字值' }
        ],
        password: [
            { required: true, message: '内容不能为空' },
            { min: 6, max: 16, message: '密码长度在 6 到 16 个字符' },
            { pattern: /^[a-zA-Z0-9_-]{6,16}$/, message: '密码只支持字母、数字和下划线' }
        ]
    };
    const switchVal = Form.useWatch('switchVal', form);
    const [cascaderLazyData, setCascaderLazyData] = useState([
        { value: 1, label: '选项1', isLeaf: false }
    ]);
    const [treeLazyData, setTreeLazyData] = useState([
        { id: 1, pId: 0, value: '1', title: 'Expand to load' },
        { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true }
    ]);
    const handleProvinceChange = (value) => {
        form.setFieldsValue({ selectCity: cityData[value][0] });
    };
    const loadCascaderLazy = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(() => {
            targetOption.loading = false;
            let id = selectedOptions.length;
            const level = selectedOptions.length;
            targetOption.children = Array.from({ length: level + 1 }).map(() => ({
                value: ++id,
                label: `选项${id}`,
                isLeaf: level >= 2
            }));
            setCascaderLazyData([...cascaderLazyData]);
        }, 1000);
    };
    const loadTreeLazy = ({ id }) => {
        const genTreeNode = (parentId, isLeaf = false) => {
            const random = Math.random().toString(36).substring(2, 6);
            return {
                id: random,
                pId: parentId,
                value: random,
                title: isLeaf ? 'Tree Node' : 'Expand to load',
                isLeaf
            };
        };
        return new Promise(resolve => {
            setTimeout(() => {
                setTreeLazyData(treeLazyData?.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]));
                resolve(undefined);
            }, 500);
        });
    };
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const resetForm = () => {
        form.resetFields();
    };
    return (_jsx(PageWrapper, { plugin: FORM_COMPO, children: _jsx(Card, { bordered: false, children: _jsxs(Form, { form: form, labelCol: { span: 6 }, wrapperCol: { span: 18 }, initialValues: { ...formState }, style: { width: '40%', margin: '0 auto' }, onFinish: onFinish, children: [_jsx(Form.Item, { label: '\u8F93\u5165\u6846(\u957F\u5EA6\u9650\u5236):', name: 'inputLimit', rules: formRules.inputLimit, children: _jsx(Input, { showCount: true, maxLength: 20, placeholder: '\u8BF7\u8F93\u5165\u5185\u5BB9' }) }), _jsx(Form.Item, { label: '\u8F93\u5165\u6846(\u7EAF\u6570\u5B57):', name: 'inputNum', rules: formRules.inputNum, children: _jsx(InputNumber, { style: { width: '100%' }, placeholder: '\u8BF7\u8F93\u5165\u6570\u5B57' }) }), _jsx(Form.Item, { label: '\u8F93\u5165\u6846(\u5BC6\u7801\u9690\u85CF):', name: 'password', rules: formRules.password, children: _jsx(Input.Password, { maxLength: 16, autoComplete: 'off', placeholder: '\u8BF7\u8F93\u5165\u5BC6\u7801' }) }), _jsx(Form.Item, { label: 'select\u9009\u62E9\u5668(\u8054\u52A8):', children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'selectProvince', children: _jsx(Select, { options: provinceData.map((pro) => ({ value: pro })), onChange: handleProvinceChange }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'selectCity', children: _jsx(Select, { options: cityData[formState.selectProvince].map((city) => ({ value: city })) }) }) })] }) }), _jsx(Form.Item, { label: '\u65E5\u671F\u548C\u65F6\u95F4\u9009\u62E9\u5668:', name: 'dateVal', children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(DatePicker, { placeholder: '\u9009\u62E9\u65E5\u671F', style: { width: '100%' } }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'timeVal', children: _jsx(TimePicker, { placeholder: '\u9009\u62E9\u65F6\u95F4', style: { width: '100%' } }) }) })] }) }), _jsx(Form.Item, { label: 'switch\u5F00\u5173(\u663E\u793A\u9690\u85CF):', name: 'switchVal', valuePropName: 'checked', children: _jsx(Switch, {}) }), !switchVal ? null : (_jsxs(_Fragment, { children: [_jsx(Form.Item, { label: '\u6ED1\u5757\u6761(\u521D\u59CB\u503C):', name: 'sliderVal', children: _jsx(Slider, {}) }), _jsx(Form.Item, { label: '\u7EA7\u8054\u9009\u62E9\u5668:', children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'cascaderVal', children: _jsx(Cascader, { options: cascaderData, placeholder: '\u8BF7\u9009\u62E9' }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'cascaderLazy', children: _jsx(Cascader, { options: cascaderLazyData, loadData: loadCascaderLazy, changeOnSelect: true, placeholder: '\u8BF7\u8F93\u5165' }) }) })] }) }), _jsx(Form.Item, { label: '\u6811\u9009\u62E9\u5668(\u53EF\u52FE\u9009):', name: 'treeVal', children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(TreeSelect, { treeData: treeData, treeCheckable: true, allowClear: true, showCheckedStrategy: TreeSelect.SHOW_PARENT, placeholder: '\u8BF7\u9009\u62E9' }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: 'treeLazy', children: _jsx(TreeSelect, { treeDataSimpleMode: true, treeData: treeLazyData, loadData: loadTreeLazy, placeholder: '\u8BF7\u9009\u62E9' }) }) })] }) }), _jsx(Form.Item, { label: '\u5355\u9009\u6846(\u5E26\u7981\u6B62):', name: 'radioVal', children: _jsx(Radio.Group, { options: radioData }) }), _jsx(Form.Item, { label: '\u591A\u9009\u6846(\u5E26\u7981\u6B62):', name: 'checkboxVal', children: _jsx(Checkbox.Group, { options: checkboxData }) }), _jsx(Form.Item, { label: '\u6587\u672C\u57DF(\u957F\u5EA6\u9650\u5236):', name: 'textareaVal', children: _jsx(Input.TextArea, { maxLength: 50, rows: 3, placeholder: '\u8BF7\u8F93\u5165\u5185\u5BB9' }) })] })), _jsxs(Form.Item, { wrapperCol: { span: 12, offset: 12 }, children: [_jsx(Button, { type: 'primary', htmlType: 'submit', children: "\u63D0\u4EA4" }), _jsx(Button, { style: { marginLeft: '12px' }, onClick: resetForm, children: "\u91CD\u7F6E" })] })] }) }) }));
};
export default BasicForm;
