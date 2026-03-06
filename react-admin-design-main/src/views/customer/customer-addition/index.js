import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Form, Input, Button } from 'antd';
import { FORM_COMPO } from '@/settings/websiteSetting';
import { PageWrapper } from '@/components/Page';
import { provinceData, cityData } from './data';
import { addCustomer } from '@/api';
import { message } from 'antd';
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
        inputLimit: [{ required: true, message: '内容不能为空' }]
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
    function handleAddCustomer() {
        const formData = form.getFieldsValue();
        addCustomer(formData)
            .then(() => {
            // 成功时显示消息
            message.success('客户添加成功！');
            form.resetFields(); //（可选）成功后可重置表单
        })
            .catch(error => {
            // 失败时显示错误信息
            message.error(`添加失败: ${error.message}`);
        });
    }
    return (_jsx(PageWrapper, { plugin: FORM_COMPO, children: _jsx(Card, { bordered: false, children: _jsxs(Form, { form: form, labelCol: { span: 6 }, wrapperCol: { span: 18 }, initialValues: { ...formState }, style: { width: '40%', margin: '0 auto' }, onFinish: onFinish, children: [_jsx(Form.Item, { label: '\u5BA2\u6237\u59D3\u540D', name: 'customer_name', rules: formRules.inputLimit, children: _jsx(Input, { showCount: true, maxLength: 20, placeholder: '\u8BF7\u8F93\u5165\u5185\u5BB9' }) }), _jsx(Form.Item, { label: '\u624B\u673A\u53F7:', name: 'telephone', rules: formRules.inputLimit, children: _jsx(Input, { showCount: true, maxLength: 20, placeholder: '\u8BF7\u8F93\u5165\u5185\u5BB9' }) }), _jsx(Form.Item, { label: '\u5730\u5740:', name: 'address', rules: formRules.inputLimit, children: _jsx(Input, { showCount: true, maxLength: 20, placeholder: '\u8BF7\u8F93\u5165\u5185\u5BB9' }) }), _jsxs(Form.Item, { wrapperCol: { span: 12, offset: 12 }, children: [_jsx(Button, { type: 'primary', htmlType: 'submit', onClick: handleAddCustomer, children: "\u63D0\u4EA4" }), _jsx(Button, { style: { marginLeft: '12px' }, onClick: resetForm, children: "\u91CD\u7F6E" })] })] }) }) }));
};
export default BasicForm;
