import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tag, Upload, message } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { createOrder, getCustomerNameList, recognizeMaterialSheet } from '@/api';
import { steeltypeData, typeData } from './data';
import styles from './index.module.less';
const materialColumns = [
    { key: 'type', label: '类型', width: 120 },
    { key: 'steel_type', label: '钢号', width: 130 },
    { key: 'length', label: '长', width: 96 },
    { key: 'length_remain', label: '余量', width: 96 },
    { key: 'width', label: '宽', width: 96 },
    { key: 'width_remain', label: '余量', width: 96 },
    { key: 'thickness', label: '厚/直径', width: 108 },
    { key: 'thickness_remain', label: '余量', width: 96 },
    { key: 'amount', label: '数量', width: 90 },
    { key: 'weight', label: '重量(kg)', width: 116 },
    { key: 'monovalent', label: '单价', width: 104 },
    { key: 'cut_fee', label: '刀费', width: 104 },
    { key: 'amount_money', label: '金额', width: 116 },
    { key: 'note', label: '备注', width: 180 },
    { key: 'actions', label: '操作', width: 112 }
];
const SQUARE_STEEL = typeData.type[0];
const ROUND_STEEL = typeData.type[1];
const formRules = {
    lengthLimit: [{ required: true, message: '材料长度不能为空' }],
    lengthRemainLimit: [{ required: true, message: '材料长度余量不能为空' }],
    thicknessLimit: [{ required: true, message: '材料厚度不能为空' }],
    thicknessRemainLimit: [{ required: true, message: '材料厚度余量不能为空' }],
    amountLimit: [{ required: true, message: '材料数量不能为空' }],
    monovalentLimit: [{ required: true, message: '材料单价不能为空' }],
    cutFeeLimit: [{ required: true, message: '刀费不能为空' }],
    processFeeLimit: [{ required: true, message: '加工费不能为空' }],
    selectCustomerLimit: [{ required: true, message: '请选择一个客户' }],
    selectTypeLimit: [{ required: true, message: '请选择材料类型' }],
    selectSteelTypeLimit: [{ required: true, message: '请选择钢号' }]
};
const getNumberValue = (value) => Number(value) || 0;
const calculateWeight = (type, length, lengthRemain, width, widthRemain, thickness, thicknessRemain, amount) => {
    const l = getNumberValue(length);
    const w = getNumberValue(width);
    const t = getNumberValue(thickness);
    const lr = getNumberValue(lengthRemain);
    const wr = getNumberValue(widthRemain);
    const tr = getNumberValue(thicknessRemain);
    const qty = getNumberValue(amount);
    if (type === SQUARE_STEEL) {
        return (qty * (l + lr) * (w + wr) * (t + tr) * 7.85) / 1000000;
    }
    return (qty * (t + tr) * (t + tr) * (l + lr) * 0.006167) / 1000;
};
const renderMetricValue = (value) => {
    if (!Number.isFinite(value) || value <= 0) {
        return '0.00';
    }
    return value.toFixed(2);
};
const decimalInputProps = {
    className: styles.fullWidth,
    controls: false,
    step: 0.01,
    min: 0,
    precision: 2,
    inputMode: 'decimal'
};
const integerInputProps = {
    className: styles.fullWidth,
    controls: false,
    step: 1,
    min: 0,
    precision: 0,
    inputMode: 'numeric'
};
const BasicForm = () => {
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState([]);
    const [recognizing, setRecognizing] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [recognizedItems, setRecognizedItems] = useState([]);
    const [recognitionWarnings, setRecognitionWarnings] = useState([]);
    const [recognitionConfidence, setRecognitionConfidence] = useState(0);
    useEffect(() => {
        const fetchCustomers = async () => {
            const data = await getCustomerNameList();
            const { records } = data;
            setCustomers(records);
        };
        void fetchCustomers();
    }, []);
    const resetForm = () => {
        form.resetFields();
    };
    const normalizeRecognizedItems = (items) => items.map((item, index) => ({
        ...item,
        rowIndex: item.rowIndex || index + 1,
        length: getNumberValue(item.length),
        length_remain: getNumberValue(item.length_remain),
        width: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width),
        width_remain: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width_remain),
        thickness: getNumberValue(item.thickness),
        thickness_remain: getNumberValue(item.thickness_remain),
        amount: getNumberValue(item.amount),
        monovalent: getNumberValue(item.monovalent),
        cut_fee: getNumberValue(item.cut_fee),
        needsReviewFields: item.needsReviewFields || [],
        fieldConfidences: item.fieldConfidences || {}
    }));
    const handleRecognizeMaterialSheet = async (file) => {
        setRecognizing(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const data = (await recognizeMaterialSheet(formData));
            setRecognizedItems(normalizeRecognizedItems(data.items || []));
            setRecognitionWarnings(data.warnings || []);
            setRecognitionConfidence(getNumberValue(data.overallConfidence));
            setPreviewOpen(true);
        }
        catch (error) {
            const fallback = error instanceof Error ? error.message : '材料单识别失败';
            message.error(fallback);
        }
        finally {
            setRecognizing(false);
        }
    };
    const updateRecognizedItem = (index, field, value) => {
        setRecognizedItems(prev => prev.map((item, itemIndex) => {
            if (itemIndex !== index) {
                return item;
            }
            const nextItem = {
                ...item,
                [field]: value,
                needsReviewFields: (item.needsReviewFields || []).filter(reviewField => reviewField !== field)
            };
            if (field === 'type' && value === ROUND_STEEL) {
                nextItem.width = 0;
                nextItem.width_remain = 0;
            }
            return nextItem;
        }));
    };
    const hasReviewField = (record, field) => Boolean(record.needsReviewFields?.includes(String(field)));
    const renderPreviewCell = (children, record, field) => (_jsx("div", { className: hasReviewField(record, field) ? styles.reviewCell : undefined, children: children }));
    const confirmRecognizedItems = () => {
        form.setFieldsValue({
            orderItems: recognizedItems.map(item => ({
                type: item.type,
                steel_type: item.steel_type,
                length: getNumberValue(item.length),
                length_remain: getNumberValue(item.length_remain),
                width: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width),
                width_remain: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width_remain),
                thickness: getNumberValue(item.thickness),
                thickness_remain: getNumberValue(item.thickness_remain),
                amount: getNumberValue(item.amount),
                monovalent: getNumberValue(item.monovalent),
                cut_fee: getNumberValue(item.cut_fee),
                note: item.note
            }))
        });
        setPreviewOpen(false);
        message.success('已填入材料明细，请检查高亮字段');
    };
    const handleAddOrder = async () => {
        try {
            const values = await form.validateFields();
            await createOrder({
                ...values,
                time: Date.now()
            });
            message.success('创建订单成功');
            form.resetFields();
        }
        catch (error) {
            const fallback = error instanceof Error ? error.message : '请检查表单内容';
            message.error(`创建订单失败: ${fallback}`);
        }
    };
    const orderItems = Form.useWatch('orderItems', form) || [];
    const processFee = getNumberValue(Form.useWatch('process_fee', form));
    const summary = orderItems.reduce((acc, item) => {
        const weight = calculateWeight(String(item?.type || ''), getNumberValue(item?.length), getNumberValue(item?.length_remain), getNumberValue(item?.width), getNumberValue(item?.width_remain), getNumberValue(item?.thickness), getNumberValue(item?.thickness_remain), getNumberValue(item?.amount));
        const amountMoney = weight * getNumberValue(item?.monovalent) + getNumberValue(item?.cut_fee);
        return {
            totalWeight: acc.totalWeight + weight,
            totalAmount: acc.totalAmount + amountMoney
        };
    }, { totalWeight: 0, totalAmount: 0 });
    const totalPayable = summary.totalAmount + processFee;
    const previewColumns = [
        {
            title: '行',
            dataIndex: 'rowIndex',
            width: 64,
            fixed: 'left'
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 120,
            render: (_, record, index) => renderPreviewCell(_jsx(Select, { className: styles.fullWidth, placeholder: '\u7C7B\u578B', value: record.type, options: typeData.type.map((typeName) => ({ value: typeName, label: typeName })), onChange: value => updateRecognizedItem(index, 'type', value) }), record, 'type')
        },
        {
            title: '钢号',
            dataIndex: 'steel_type',
            width: 130,
            render: (_, record, index) => renderPreviewCell(_jsx(Select, { showSearch: true, className: styles.fullWidth, placeholder: '\u94A2\u53F7', value: record.steel_type, options: steeltypeData.type.map((steelTypeName) => ({ value: steelTypeName, label: steelTypeName })), onChange: value => updateRecognizedItem(index, 'steel_type', value) }), record, 'steel_type')
        },
        ...[
            ['length', '长'],
            ['length_remain', '长余量'],
            ['width', '宽'],
            ['width_remain', '宽余量'],
            ['thickness', '厚/直径'],
            ['thickness_remain', '厚余量'],
            ['amount', '数量'],
            ['monovalent', '单价'],
            ['cut_fee', '刀费']
        ].map(([field, title]) => ({
            title,
            dataIndex: field,
            width: 110,
            render: (_, record, index) => renderPreviewCell(_jsx(InputNumber, { ...(field === 'amount' ? integerInputProps : decimalInputProps), disabled: record.type === ROUND_STEEL && (field === 'width' || field === 'width_remain'), value: record[field], onChange: value => updateRecognizedItem(index, field, value) }), record, field)
        })),
        {
            title: '备注',
            dataIndex: 'note',
            width: 180,
            render: (_, record, index) => renderPreviewCell(_jsx(Input, { value: record.note, placeholder: '\u5907\u6CE8', onChange: event => updateRecognizedItem(index, 'note', event.target.value) }), record, 'note')
        },
        {
            title: '待确认',
            dataIndex: 'needsReviewFields',
            width: 180,
            render: (_, record) => (_jsx(Space, { size: [4, 4], wrap: true, children: (record.needsReviewFields || []).map(field => (_jsx(Tag, { color: 'orange', children: field }, field))) }))
        },
        {
            title: '模型备注',
            dataIndex: 'sourceNote',
            width: 220
        }
    ];
    return (_jsxs("div", { className: styles.pageShell, children: [_jsxs(Card, { bordered: false, className: styles.pageCard, children: [_jsx("div", { className: styles.pageHeader, children: _jsx("div", { children: _jsx("h3", { className: styles.pageTitle, children: "\u6DFB\u52A0\u8D26\u5355" }) }) }), _jsxs(Form, { form: form, layout: 'vertical', initialValues: {
                            orderItems: [{}]
                        }, className: styles.form, children: [_jsx(Card, { size: 'small', className: styles.sectionCard, title: '\u5BA2\u6237\u4FE1\u606F', children: _jsx(Row, { gutter: 16, children: _jsx(Col, { xs: 24, md: 16, lg: 12, children: _jsx(Form.Item, { label: '\u9009\u62E9\u5BA2\u6237', name: 'customer_id', rules: formRules.selectCustomerLimit, children: _jsx(Select, { showSearch: true, placeholder: '\u8BF7\u9009\u62E9\u5BA2\u6237', optionFilterProp: 'label', options: customers.map((customer) => ({
                                                    value: customer.id,
                                                    label: `${customer.customer_name} (${customer.telephone || '无电话'})`
                                                })) }) }) }) }) }), _jsx(Card, { size: 'small', className: styles.sectionCard, title: '\u8D26\u5355\u4FE1\u606F', children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { xs: 24, md: 8, lg: 6, children: _jsx(Form.Item, { label: '\u52A0\u5DE5\u8D39', name: 'process_fee', rules: formRules.processFeeLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u8BF7\u8F93\u5165\u52A0\u5DE5\u8D39' }) }) }), _jsx(Col, { xs: 24, md: 16, lg: 18, children: _jsx(Form.Item, { label: '\u5907\u6CE8', name: 'note', children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u5907\u6CE8\u4FE1\u606F' }) }) })] }) }), _jsx(Card, { size: 'small', className: styles.sectionCard, title: '\u6750\u6599\u660E\u7EC6', extra: _jsx(Upload, { accept: 'image/png,image/jpeg,image/webp', showUploadList: false, beforeUpload: file => {
                                        void handleRecognizeMaterialSheet(file);
                                        return Upload.LIST_IGNORE;
                                    }, children: _jsx(Button, { icon: _jsx(UploadOutlined, {}), loading: recognizing, children: "\u4E0A\u4F20\u6750\u6599\u5355\u8BC6\u522B" }) }), children: _jsx(Form.List, { name: 'orderItems', children: (fields, { add, remove }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.tableScroller, children: _jsxs("div", { className: styles.materialTable, style: { minWidth: materialColumns.reduce((sum, col) => sum + col.width, 0) }, children: [_jsx("div", { className: styles.tableHead, children: materialColumns.map(column => (_jsx("div", { className: styles.headCell, style: { width: column.width, minWidth: column.width }, children: column.label }, column.key))) }), _jsx("div", { className: styles.tableBody, children: fields.map(field => {
                                                                const item = orderItems[field.name] || {};
                                                                const itemType = String(item?.type || '');
                                                                const isRoundSteel = itemType === ROUND_STEEL;
                                                                const thicknessPlaceholder = itemType === SQUARE_STEEL ? '厚' : itemType === ROUND_STEEL ? '直径' : '厚/直径';
                                                                const weight = calculateWeight(itemType, getNumberValue(item?.length), getNumberValue(item?.length_remain), getNumberValue(item?.width), getNumberValue(item?.width_remain), getNumberValue(item?.thickness), getNumberValue(item?.thickness_remain), getNumberValue(item?.amount));
                                                                const amountMoney = weight * getNumberValue(item?.monovalent) + getNumberValue(item?.cut_fee);
                                                                return (_jsxs("div", { className: styles.tableRow, children: [_jsx("div", { className: styles.tableCell, style: { width: 120, minWidth: 120 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'type'], className: styles.inlineItem, rules: formRules.selectTypeLimit, children: _jsx(Select, { placeholder: '\u7C7B\u578B', options: typeData.type.map((typeName) => ({
                                                                                        value: typeName,
                                                                                        label: typeName
                                                                                    })) }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 130, minWidth: 130 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'steel_type'], className: styles.inlineItem, rules: formRules.selectSteelTypeLimit, children: _jsx(Select, { placeholder: '\u94A2\u53F7', options: steeltypeData.type.map((steelTypeName) => ({
                                                                                        value: steelTypeName,
                                                                                        label: steelTypeName
                                                                                    })) }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 96, minWidth: 96 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'length'], className: styles.inlineItem, rules: formRules.lengthLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u957F' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 96, minWidth: 96 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'length_remain'], className: styles.inlineItem, rules: formRules.lengthRemainLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u4F59\u91CF' }) }) }), _jsx("div", { className: `${styles.tableCell} ${isRoundSteel ? styles.emptyFieldCell : ''}`, style: { width: 96, minWidth: 96 }, children: !isRoundSteel && (_jsx(Form.Item, { ...field, name: [field.name, 'width'], className: styles.inlineItem, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u5BBD' }) })) }), _jsx("div", { className: `${styles.tableCell} ${isRoundSteel ? styles.emptyFieldCell : ''}`, style: { width: 96, minWidth: 96 }, children: !isRoundSteel && (_jsx(Form.Item, { ...field, name: [field.name, 'width_remain'], className: styles.inlineItem, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u4F59\u91CF' }) })) }), _jsx("div", { className: styles.tableCell, style: { width: 108, minWidth: 108 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'thickness'], className: styles.inlineItem, rules: formRules.thicknessLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: thicknessPlaceholder }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 96, minWidth: 96 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'thickness_remain'], className: styles.inlineItem, rules: formRules.thicknessRemainLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u4F59\u91CF' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 90, minWidth: 90 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'amount'], className: styles.inlineItem, rules: formRules.amountLimit, children: _jsx(InputNumber, { ...integerInputProps, placeholder: '\u6570\u91CF' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 116, minWidth: 116 }, children: _jsx("div", { className: styles.metricBox, children: renderMetricValue(weight) }) }), _jsx("div", { className: styles.tableCell, style: { width: 104, minWidth: 104 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'monovalent'], className: styles.inlineItem, rules: formRules.monovalentLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u5355\u4EF7' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 104, minWidth: 104 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'cut_fee'], className: styles.inlineItem, rules: formRules.cutFeeLimit, children: _jsx(InputNumber, { ...decimalInputProps, placeholder: '\u5200\u8D39' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 116, minWidth: 116 }, children: _jsx("div", { className: `${styles.metricBox} ${styles.metricAccent}`, children: renderMetricValue(amountMoney) }) }), _jsx("div", { className: styles.tableCell, style: { width: 180, minWidth: 180 }, children: _jsx(Form.Item, { ...field, name: [field.name, 'note'], className: styles.inlineItem, children: _jsx(Input, { placeholder: '\u5907\u6CE8' }) }) }), _jsx("div", { className: styles.tableCell, style: { width: 112, minWidth: 112 }, children: _jsxs("div", { className: styles.rowActions, children: [_jsx(Button, { type: 'text', icon: _jsx(PlusOutlined, {}), onClick: () => add({}), className: styles.iconButton }), _jsx(Button, { danger: true, type: 'text', icon: _jsx(DeleteOutlined, {}), onClick: () => remove(field.name), disabled: fields.length === 1, className: styles.iconButton })] }) })] }, field.key));
                                                            }) })] }) }), _jsxs("div", { className: styles.tableFooter, children: [_jsx(Button, { type: 'dashed', onClick: () => add({}), icon: _jsx(PlusOutlined, {}), children: "\u6DFB\u52A0\u65B0\u884C" }), _jsxs("div", { className: styles.summaryBar, children: [_jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u603B\u91CD\u91CF" }), _jsxs("strong", { children: [renderMetricValue(summary.totalWeight), " kg"] })] }), _jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u6750\u6599\u91D1\u989D" }), _jsx("strong", { children: renderMetricValue(summary.totalAmount) })] }), _jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u8D26\u5355\u603B\u989D" }), _jsx("strong", { children: renderMetricValue(totalPayable) })] })] })] })] })) }) }), _jsxs(Form.Item, { className: styles.actionBar, children: [_jsx(Button, { type: 'primary', onClick: handleAddOrder, children: "\u63D0\u4EA4" }), _jsx(Button, { onClick: resetForm, children: "\u91CD\u7F6E" })] })] })] }), _jsx(Modal, { title: '\u6750\u6599\u5355\u8BC6\u522B\u9884\u89C8', open: previewOpen, width: 1180, okText: '\u786E\u8BA4\u586B\u5165\u6750\u6599\u660E\u7EC6', cancelText: '\u53D6\u6D88', onOk: confirmRecognizedItems, onCancel: () => setPreviewOpen(false), okButtonProps: { disabled: recognizedItems.length === 0 }, children: _jsxs(Space, { direction: 'vertical', className: styles.fullWidth, size: 12, children: [_jsx(Alert, { showIcon: true, type: 'info', message: `整体置信度 ${(recognitionConfidence * 100).toFixed(0)}%，请重点检查高亮字段` }), recognitionWarnings.length > 0 && (_jsx(Alert, { showIcon: true, type: 'warning', message: '\u8BC6\u522B\u63D0\u793A', description: recognitionWarnings.join('；') })), _jsx(Table, { size: 'small', rowKey: (record, index) => `${record.rowIndex}-${index}`, columns: previewColumns, dataSource: recognizedItems, pagination: false, scroll: { x: 1500 } })] }) })] }));
};
export default BasicForm;
