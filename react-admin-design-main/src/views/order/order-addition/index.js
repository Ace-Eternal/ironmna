import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Input, InputNumber, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FORM_COMPO } from '@/settings/websiteSetting';
import { PageWrapper } from '@/components/Page';
import { provinceData, cityData, typeData, steeltypeData } from './data';
import { createOrder } from '@/api';
import { message } from 'antd';
import { getCustomerNameList } from '@/api';
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
        lengthLimit: [{ required: true, message: '材料长度不能为空' }],
        lengthRemainLimit: [{ required: true, message: '材料长度余量不能为空' }],
        thicknessLimit: [{ required: true, message: '材料厚度不能为空' }],
        thicknessRemainLimit: [{ required: true, message: '材料厚度余量不能为空' }],
        amountLimit: [{ required: true, message: '材料件数不能为空' }],
        monovalentLimit: [{ required: true, message: '材料单价不能为空' }],
        cutFeeLimit: [{ required: true, message: '刀费不能为空' }],
        processFeeLimit: [{ required: true, message: '加工费不能为空' }],
        selectCustomerLimit: [{ required: true, message: '请选择一个客户！' }],
        selectTypeLimit: [{ required: true, message: '请选择材料类型！' }],
        selectSteelTypeLimit: [{ required: true, message: '请选择钢号！' }]
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
    // 客户姓名+手机号列表
    const [customerDate, setCustomerDate] = useState([]);
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
    function handleAddOrder() {
        const formData = form.getFieldsValue();
        formData.time = Date.now();
        console.log('here is time');
        createOrder(formData)
            .then(() => {
            // 成功时显示消息
            message.success('创建订单成功！');
            form.resetFields(); //（可选）成功后可重置表单
        })
            .catch(error => {
            // 失败时显示错误信息
            message.error(`创建订单失败: ${error.message}`);
        });
    }
    useEffect(() => {
        fetchData();
    }, []);
    async function fetchData() {
        const data = await getCustomerNameList();
        const { records } = data;
        setCustomerDate(records);
    }
    const [rows, setRows] = useState([{ key: 0 }]);
    const addNewRow = () => {
        setRows([...rows, { key: rows.length }]);
    };
    const calculateWeight = (type, length, length_remain, width, width_remain, thickness, thickness_remain, amount) => {
        const l = Number(length) || 0;
        const w = Number(width) || 0;
        const t = Number(thickness) || 0;
        const lr = Number(length_remain) || 0;
        const wr = Number(width_remain) || 0;
        const tr = Number(thickness_remain) || 0;
        if (type === '方钢') {
            return (amount * (l + lr) * (w + wr) * (t + tr) * 7.85) / 1000000;
        }
        else {
            return (amount * (t + tr) * (t + tr) * (l + lr) * 0.006167) / 1000;
        }
    };
    return (_jsx(PageWrapper, { plugin: FORM_COMPO, children: _jsx(Card, { bordered: false, children: _jsxs(Form, { form: form, labelCol: { span: 6 }, wrapperCol: { span: 18 }, initialValues: { ...formState }, style: { width: '100%', margin: '0 auto' }, onFinish: onFinish, children: [_jsx(Form.Item, { label: '\u9009\u62E9\u5BA2\u6237:', children: _jsx(Row, { gutter: 12, children: _jsx(Col, { span: 20, children: _jsx(Form.Item, { name: 'customer_id', rules: formRules.selectCustomerLimit, children: _jsx(Select, { options: customerDate.map((customer) => ({
                                            value: customer.id,
                                            label: `${customer.customer_name} (${customer.telephone})`
                                        })) }) }) }) }) }), _jsxs(Row, { gutter: 8, style: { marginBottom: 8 }, children: [_jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u7C7B\u578B" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u94A2\u53F7" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u957F" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u4F59\u91CF" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u5BBD" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u4F59\u91CF" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u539A/\u76F4\u5F84" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u4F59\u91CF" }) }), _jsx(Col, { span: 1, children: _jsx("div", { className: 'compact-label', children: "\u6570\u91CF" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u91CD\u91CF(kg)" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u5355\u4EF7" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u5200\u8D39" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u91D1\u989D" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u5907\u6CE8" }) }), _jsx(Col, { span: 2, children: _jsx("div", { className: 'compact-label', children: "\u64CD\u4F5C" }) })] }), _jsx(Form.List, { name: 'orderItems', children: (fields, { add, remove }) => (_jsxs(_Fragment, { children: [fields.map((field, index) => {
                                    // Get current field values for weight calculation
                                    const type = form.getFieldValue(['orderItems', field.name, 'type']);
                                    const length = form.getFieldValue(['orderItems', field.name, 'length']);
                                    const length_remain = form.getFieldValue(['orderItems', field.name, 'length_remain']);
                                    const width = form.getFieldValue(['orderItems', field.name, 'width']);
                                    const width_remain = form.getFieldValue(['orderItems', field.name, 'width_remain']);
                                    const thickness = form.getFieldValue(['orderItems', field.name, 'thickness']);
                                    const thickness_remain = form.getFieldValue(['orderItems', field.name, 'thickness_remain']);
                                    const amount = form.getFieldValue(['orderItems', field.name, 'amount']);
                                    const monovalent = form.getFieldValue(['orderItems', field.name, 'monovalent']);
                                    const cut_fee = form.getFieldValue(['orderItems', field.name, 'cut_fee']);
                                    const weight = calculateWeight(type, length, length_remain, width, width_remain, thickness, thickness_remain, amount);
                                    return (_jsxs(Row, { gutter: 8, style: { marginBottom: 8 }, children: [_jsx(Col, { span: 2, children: _jsx(Form.Item, { ...field, name: [field.name, 'type'], style: { marginBottom: 0 }, rules: formRules.selectTypeLimit, children: _jsx(Select, { placeholder: '\u6750\u6599\u7C7B\u578B', options: typeData.type.map((typeName) => ({
                                                            value: typeName,
                                                            label: typeName
                                                        })) }) }) }), _jsx(Col, { span: 2, children: _jsx(Form.Item, { ...field, name: [field.name, 'steel_type'], style: { marginBottom: 0 }, rules: formRules.selectSteelTypeLimit, children: _jsx(Select, { placeholder: '\u94A2\u53F7', options: steeltypeData.type.map((steeltypeName) => ({
                                                            value: steeltypeName,
                                                            label: steeltypeName
                                                        })) }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'length'], style: { marginBottom: 0 }, rules: formRules.lengthLimit, children: _jsx(InputNumber, { placeholder: '\u957F' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'length_remain'], style: { marginBottom: 0 }, rules: formRules.lengthRemainLimit, children: _jsx(InputNumber, { placeholder: '\u4F59\u91CF' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'width'], style: { marginBottom: 0 }, children: _jsx(InputNumber, { placeholder: '\u5BBD' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'width_remain'], style: { marginBottom: 0 }, children: _jsx(InputNumber, { placeholder: '\u4F59\u91CF' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'thickness'], style: { marginBottom: 0 }, rules: formRules.thicknessLimit, children: _jsx(InputNumber, { placeholder: '\u9AD8' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'thickness_remain'], style: { marginBottom: 0 }, rules: formRules.thicknessRemainLimit, children: _jsx(InputNumber, { placeholder: '\u4F59\u91CF' }) }) }), _jsx(Col, { span: 1, children: _jsx(Form.Item, { ...field, name: [field.name, 'amount'], style: { marginBottom: 0 }, rules: formRules.amountLimit, children: _jsx(InputNumber, { placeholder: '\u6570\u91CF' }) }) }), _jsx(Col, { span: 2, children: _jsx("div", { style: {
                                                        padding: '4px 0',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: 4,
                                                        fontSize: 12,
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }, children: weight ? weight.toFixed(2) : '0.00' }) }), _jsx(Col, { span: 2, children: _jsx(Form.Item, { ...field, name: [field.name, 'monovalent'], style: { marginBottom: 0 }, rules: formRules.monovalentLimit, children: _jsx(InputNumber, { placeholder: '\u5355\u4EF7' }) }) }), _jsx(Col, { span: 2, children: _jsx(Form.Item, { ...field, name: [field.name, 'cut_fee'], style: { marginBottom: 0 }, rules: formRules.cutFeeLimit, children: _jsx(InputNumber, { placeholder: '\u5200\u8D39' }) }) }), _jsx(Col, { span: 2, children: _jsx("div", { style: {
                                                        padding: '4px 0',
                                                        textAlign: 'center',
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: 4,
                                                        fontSize: 12,
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }, children: weight * monovalent + cut_fee ? (weight * monovalent + cut_fee).toFixed(2) : '0.00' }) }), _jsx(Col, { span: 2, children: _jsx(Form.Item, { ...field, name: [field.name, 'note'], style: { marginBottom: 0 }, children: _jsx(Input, { placeholder: '\u5907\u6CE8' }) }) }), _jsxs(Col, { span: 2, children: [_jsx(Button, { onClick: () => addNewRow(), size: 'small', style: { height: '100%', marginRight: '5px' }, children: "\u8BA1\u7B97" }), _jsx(Button, { danger: true, onClick: () => remove(index), size: 'small', style: { height: '100%' }, children: "\u5220\u9664" })] })] }, rows[index].key));
                                }), _jsx(Button, { type: 'dashed', onClick: () => {
                                        add();
                                        addNewRow();
                                    }, icon: _jsx(PlusOutlined, {}), style: { width: '100%' }, children: "\u6DFB\u52A0\u65B0\u884C" })] })) }), _jsx(Form.Item, { label: '\u52A0\u5DE5\u8D39', name: 'process_fee', style: { marginTop: '16px' }, rules: formRules.processFeeLimit, children: _jsx(InputNumber, { placeholder: '\u8BF7\u8F93\u5165\u52A0\u5DE5\u8D39' }) }), _jsx(Form.Item, { label: '\u5907\u6CE8', name: 'note', children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u5907\u6CE8' }) }), _jsxs(Form.Item, { wrapperCol: { span: 24 }, style: {
                            textAlign: 'center', // 子元素水平居中
                            marginTop: 16 // 适当的上边距
                        }, children: [_jsx(Button, { type: 'primary', htmlType: 'submit', onClick: handleAddOrder, children: "\u63D0\u4EA4" }), _jsx(Button, { style: { marginLeft: '12px' }, onClick: resetForm, children: "\u91CD\u7F6E" })] })] }) }) }));
};
export default BasicForm;
