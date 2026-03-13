import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Tag, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getDownloadUrl, getOrderDetail, updateOrder } from '@/api';
import { steeltypeData, typeData } from '../order-addition/data';
import styles from './index.module.less';
const SQUARE_STEEL = typeData.type[0];
const ROUND_STEEL = typeData.type[1];
const NEW_ROW_PREFIX = 'new-item-';
const getNumberValue = (value) => Number(value) || 0;
const isTemporaryRowId = (value) => String(value).startsWith(NEW_ROW_PREFIX);
const createEmptyOrderItem = () => ({
    id: `${NEW_ROW_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: '',
    steel_type: '',
    length: 0,
    length_remain: 0,
    width: 0,
    width_remain: 0,
    thickness: 0,
    thickness_remain: 0,
    amount: 0,
    note: '',
    monovalent: 0,
    total_weight: 0,
    steel_money: 0,
    cut_fee: 0
});
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
const TableEditRow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialOrderDetail = location.state?.orderDetail;
    const [billForm] = Form.useForm();
    const [rowForm] = Form.useForm();
    const [orderDetail, setOrderDetail] = useState(initialOrderDetail || null);
    const [orderItems, setOrderItems] = useState(initialOrderDetail?.orderItemList || []);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editingBill, setEditingBill] = useState(false);
    const [saving, setSaving] = useState(false);
    const editingRowValues = Form.useWatch([], rowForm);
    const watchedProcessFee = Form.useWatch('process_fee', billForm);
    const syncOrderState = (detail) => {
        setOrderDetail(detail);
        setOrderItems(detail.orderItemList || []);
        billForm.setFieldsValue({
            process_fee: detail.process_fee,
            paid_money: detail.paid_money,
            note: detail.note
        });
    };
    useEffect(() => {
        if (!initialOrderDetail) {
            navigate('/order/order-basic');
            return;
        }
        syncOrderState(initialOrderDetail);
    }, [initialOrderDetail, navigate, billForm]);
    const previewOrderItems = useMemo(() => orderItems.map(item => item.id === editingRowId && editingRowValues ? { ...item, ...editingRowValues } : item), [editingRowId, editingRowValues, orderItems]);
    const summary = useMemo(() => {
        const totalWeight = previewOrderItems.reduce((sum, item) => sum +
            calculateWeight(item.type, item.length, item.length_remain, item.width, item.width_remain, item.thickness, item.thickness_remain, item.amount), 0);
        const processFee = getNumberValue(watchedProcessFee ?? orderDetail?.process_fee);
        const totalAmount = previewOrderItems.reduce((sum, item) => {
            const weight = calculateWeight(item.type, item.length, item.length_remain, item.width, item.width_remain, item.thickness, item.thickness_remain, item.amount);
            return sum + weight * getNumberValue(item.monovalent) + getNumberValue(item.cut_fee);
        }, 0);
        return {
            totalWeight,
            materialAmount: totalAmount,
            totalPayable: totalAmount + processFee
        };
    }, [orderDetail?.process_fee, previewOrderItems, watchedProcessFee]);
    if (!orderDetail) {
        return null;
    }
    const buildPayload = (items) => {
        const billValues = billForm.getFieldsValue();
        return {
            order_id: String(orderDetail.id),
            customer_id: String(orderDetail.customer_id),
            process_fee: getNumberValue(billValues.process_fee),
            paid_money: getNumberValue(billValues.paid_money),
            note: billValues.note || '',
            orderItemVOs: items.map(item => ({
                type: item.type,
                steel_type: item.steel_type,
                length: getNumberValue(item.length),
                length_remain: getNumberValue(item.length_remain),
                width: getNumberValue(item.width),
                width_remain: getNumberValue(item.width_remain),
                thickness: getNumberValue(item.thickness),
                thickness_remain: getNumberValue(item.thickness_remain),
                amount: getNumberValue(item.amount),
                note: item.note || '',
                monovalent: getNumberValue(item.monovalent),
                cut_fee: getNumberValue(item.cut_fee)
            }))
        };
    };
    const persistOrder = async (items) => {
        const payload = buildPayload(items);
        setSaving(true);
        try {
            await updateOrder(payload);
            const refreshedOrder = (await getOrderDetail(orderDetail.id));
            syncOrderState(refreshedOrder);
            message.success('保存成功');
        }
        catch (error) {
            const fallback = error instanceof Error ? error.message : '保存失败';
            message.error(`保存失败: ${fallback}`);
            throw error;
        }
        finally {
            setSaving(false);
        }
    };
    const handleEditBill = () => {
        setEditingBill(true);
    };
    const handleSaveBill = async () => {
        await billForm.validateFields();
        await persistOrder(orderItems);
        setEditingBill(false);
    };
    const handleCancelBill = () => {
        billForm.setFieldsValue({
            process_fee: orderDetail.process_fee,
            paid_money: orderDetail.paid_money,
            note: orderDetail.note
        });
        setEditingBill(false);
    };
    const handleEditRow = (item) => {
        rowForm.setFieldsValue(item);
        setEditingRowId(item.id);
    };
    const handleAddRow = () => {
        if (editingRowId !== null || saving) {
            return;
        }
        const newItem = createEmptyOrderItem();
        setOrderItems(prev => [...prev, newItem]);
        rowForm.setFieldsValue(newItem);
        setEditingRowId(newItem.id);
    };
    const handleCancelRow = () => {
        if (editingRowId !== null && isTemporaryRowId(editingRowId)) {
            setOrderItems(prev => prev.filter(item => item.id !== editingRowId));
        }
        rowForm.resetFields();
        setEditingRowId(null);
    };
    const handleSaveRow = async (itemId) => {
        const rowValues = await rowForm.validateFields();
        const nextItems = orderItems.map(item => (item.id === itemId ? { ...item, ...rowValues } : item));
        await persistOrder(nextItems);
        setEditingRowId(null);
    };
    const handleExportOrder = async () => {
        try {
            const fileName = await getDownloadUrl(orderDetail.id);
            if (!fileName) {
                throw new Error('未获取到导出文件');
            }
            window.open(`/iron/order/download?file=${String(fileName)}`, '_blank');
        }
        catch (error) {
            const fallback = error instanceof Error ? error.message : '导出失败';
            message.error(`导出失败: ${fallback}`);
        }
    };
    const renderEditableField = (item, field) => {
        const editing = editingRowId === item.id;
        const currentType = editing ? rowForm.getFieldValue('type') || item.type : item.type;
        const isRoundSteel = currentType === ROUND_STEEL;
        if (!editing) {
            if ((field === 'width' || field === 'width_remain') && isRoundSteel) {
                return _jsx("span", { className: styles.emptyValue, children: "-" });
            }
            if (field === 'thickness') {
                return _jsx("span", { children: item.thickness });
            }
            return _jsx("span", { children: item[field] });
        }
        if ((field === 'width' || field === 'width_remain') && isRoundSteel) {
            return _jsx("span", { className: styles.emptyValue, children: "-" });
        }
        switch (field) {
            case 'type':
                return (_jsx(Form.Item, { name: 'type', className: styles.inlineItem, rules: [{ required: true, message: '请选择类型' }], children: _jsx(Select, { options: typeData.type.map(typeName => ({
                            value: typeName,
                            label: typeName
                        })) }) }));
            case 'steel_type':
                return (_jsx(Form.Item, { name: 'steel_type', className: styles.inlineItem, rules: [{ required: true, message: '请选择钢号' }], children: _jsx(Select, { options: steeltypeData.type.map(typeName => ({
                            value: typeName,
                            label: typeName
                        })) }) }));
            case 'amount':
                return (_jsx(Form.Item, { name: 'amount', className: styles.inlineItem, rules: [{ required: true, message: '请输入数量' }], children: _jsx(InputNumber, { ...integerInputProps }) }));
            case 'note':
                return (_jsx(Form.Item, { name: 'note', className: styles.inlineItem, children: _jsx(Input, {}) }));
            case 'thickness':
                return (_jsx(Form.Item, { name: 'thickness', className: styles.inlineItem, rules: [{ required: true, message: '请输入厚度或直径' }], children: _jsx(InputNumber, { ...decimalInputProps, placeholder: currentType === ROUND_STEEL ? '直径' : '厚' }) }));
            default:
                return (_jsx(Form.Item, { name: field, className: styles.inlineItem, rules: [{ required: true, message: '请完善当前行数据' }], children: _jsx(InputNumber, { ...decimalInputProps }) }));
        }
    };
    return (_jsx("div", { className: styles.pageShell, children: _jsxs(Card, { bordered: false, className: styles.pageCard, children: [_jsxs("div", { className: styles.headerBar, children: [_jsx("div", { children: _jsx("h3", { className: styles.pageTitle, children: "\u8D26\u5355\u8BE6\u60C5" }) }), _jsx(Button, { type: 'primary', onClick: handleExportOrder, children: "\u5BFC\u51FA\u8D26\u5355" })] }), _jsxs(Card, { size: 'small', className: styles.sectionCard, title: '\u8D26\u5355\u6982\u89C8', children: [_jsxs("div", { className: styles.tagRow, children: [_jsxs(Tag, { color: 'blue', children: ["\u8BA2\u5355\u53F7: ", orderDetail.id] }), _jsxs(Tag, { color: 'green', children: ["\u5BA2\u6237: ", orderDetail.customer?.customer_name] }), _jsxs(Tag, { color: 'orange', children: ["\u7535\u8BDD: ", orderDetail.customer?.telephone] }), _jsxs(Tag, { color: 'gold', children: ["\u4E0B\u5355\u65F6\u95F4: ", dayjs(orderDetail.time).format('YYYY-MM-DD HH:mm')] })] }), _jsx(Form, { form: billForm, layout: 'vertical', children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { xs: 24, md: 6, children: _jsx(Form.Item, { label: '\u52A0\u5DE5\u8D39', name: 'process_fee', rules: [{ required: true, message: '请输入加工费' }], children: _jsx(InputNumber, { ...decimalInputProps, disabled: !editingBill }) }) }), _jsx(Col, { xs: 24, md: 6, children: _jsx(Form.Item, { label: '\u5DF2\u4ED8\u91D1\u989D', name: 'paid_money', children: _jsx(InputNumber, { ...decimalInputProps, disabled: !editingBill }) }) }), _jsx(Col, { xs: 24, md: 12, children: _jsx(Form.Item, { label: '\u5907\u6CE8', name: 'note', children: _jsx(Input, { disabled: !editingBill }) }) })] }) }), _jsxs("div", { className: styles.summaryBar, children: [_jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u603B\u91CD\u91CF" }), _jsxs("strong", { children: [renderMetricValue(summary.totalWeight), " kg"] })] }), _jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u6750\u6599\u91D1\u989D" }), _jsx("strong", { children: renderMetricValue(summary.materialAmount) })] }), _jsxs("div", { className: styles.summaryItem, children: [_jsx("span", { className: styles.summaryLabel, children: "\u8D26\u5355\u603B\u989D" }), _jsx("strong", { children: renderMetricValue(summary.totalPayable) })] })] }), _jsx("div", { className: styles.toolbar, children: editingBill ? (_jsxs(Space, { children: [_jsx(Button, { type: 'primary', onClick: handleSaveBill, loading: saving, children: "\u4FDD\u5B58\u8D26\u5355\u4FE1\u606F" }), _jsx(Button, { onClick: handleCancelBill, children: "\u53D6\u6D88" })] })) : (_jsx(Button, { onClick: handleEditBill, children: "\u7F16\u8F91\u8D26\u5355\u4FE1\u606F" })) })] }), _jsxs(Card, { size: 'small', className: styles.sectionCard, title: '\u6750\u6599\u660E\u7EC6', children: [_jsx("div", { className: styles.toolbar, children: _jsx(Button, { type: 'dashed', icon: _jsx(PlusOutlined, {}), onClick: handleAddRow, disabled: editingRowId !== null || saving, children: "\u6DFB\u52A0\u65B0\u6750\u6599\u9879" }) }), _jsx("div", { className: styles.tableScroller, children: _jsxs("div", { className: styles.detailTable, children: [_jsxs("div", { className: styles.tableHead, children: [_jsx("div", { className: styles.headCell, style: { width: 110 }, children: "\u7C7B\u578B" }), _jsx("div", { className: styles.headCell, style: { width: 120 }, children: "\u94A2\u53F7" }), _jsx("div", { className: styles.headCell, style: { width: 84 }, children: "\u957F" }), _jsx("div", { className: styles.headCell, style: { width: 84 }, children: "\u4F59\u91CF" }), _jsx("div", { className: styles.headCell, style: { width: 84 }, children: "\u5BBD" }), _jsx("div", { className: styles.headCell, style: { width: 84 }, children: "\u4F59\u91CF" }), _jsx("div", { className: styles.headCell, style: { width: 92 }, children: "\u539A/\u76F4\u5F84" }), _jsx("div", { className: styles.headCell, style: { width: 84 }, children: "\u4F59\u91CF" }), _jsx("div", { className: styles.headCell, style: { width: 80 }, children: "\u6570\u91CF" }), _jsx("div", { className: styles.headCell, style: { width: 96 }, children: "\u91CD\u91CF(kg)" }), _jsx("div", { className: styles.headCell, style: { width: 90 }, children: "\u5355\u4EF7" }), _jsx("div", { className: styles.headCell, style: { width: 90 }, children: "\u5200\u8D39" }), _jsx("div", { className: styles.headCell, style: { width: 100 }, children: "\u91D1\u989D" }), _jsx("div", { className: styles.headCell, style: { width: 180 }, children: "\u5907\u6CE8" }), _jsx("div", { className: styles.headCell, style: { width: 130 }, children: "\u64CD\u4F5C" })] }), _jsx(Form, { form: rowForm, component: false, children: _jsx("div", { className: styles.tableBody, children: orderItems.map(item => {
                                                const currentItem = item.id === editingRowId && editingRowValues ? { ...item, ...editingRowValues } : item;
                                                const rowType = currentItem.type || item.type;
                                                const isRoundSteel = rowType === ROUND_STEEL;
                                                const weight = calculateWeight(rowType, getNumberValue(currentItem.length), getNumberValue(currentItem.length_remain), getNumberValue(currentItem.width), getNumberValue(currentItem.width_remain), getNumberValue(currentItem.thickness), getNumberValue(currentItem.thickness_remain), getNumberValue(currentItem.amount));
                                                const amountMoney = weight * getNumberValue(currentItem.monovalent) + getNumberValue(currentItem.cut_fee);
                                                return (_jsxs("div", { className: styles.tableRow, children: [_jsx("div", { className: styles.tableCell, style: { width: 110 }, children: renderEditableField(item, 'type') }), _jsx("div", { className: styles.tableCell, style: { width: 120 }, children: renderEditableField(item, 'steel_type') }), _jsx("div", { className: styles.tableCell, style: { width: 84 }, children: renderEditableField(item, 'length') }), _jsx("div", { className: styles.tableCell, style: { width: 84 }, children: renderEditableField(item, 'length_remain') }), _jsx("div", { className: `${styles.tableCell} ${isRoundSteel ? styles.emptyCell : ''}`, style: { width: 84 }, children: renderEditableField(item, 'width') }), _jsx("div", { className: `${styles.tableCell} ${isRoundSteel ? styles.emptyCell : ''}`, style: { width: 84 }, children: renderEditableField(item, 'width_remain') }), _jsx("div", { className: styles.tableCell, style: { width: 92 }, children: renderEditableField(item, 'thickness') }), _jsx("div", { className: styles.tableCell, style: { width: 84 }, children: renderEditableField(item, 'thickness_remain') }), _jsx("div", { className: styles.tableCell, style: { width: 80 }, children: renderEditableField(item, 'amount') }), _jsx("div", { className: styles.tableCell, style: { width: 96 }, children: _jsx("div", { className: styles.metricBox, children: renderMetricValue(weight) }) }), _jsx("div", { className: styles.tableCell, style: { width: 90 }, children: renderEditableField(item, 'monovalent') }), _jsx("div", { className: styles.tableCell, style: { width: 90 }, children: renderEditableField(item, 'cut_fee') }), _jsx("div", { className: styles.tableCell, style: { width: 100 }, children: _jsx("div", { className: `${styles.metricBox} ${styles.metricAccent}`, children: renderMetricValue(amountMoney) }) }), _jsx("div", { className: styles.tableCell, style: { width: 180 }, children: renderEditableField(item, 'note') }), _jsx("div", { className: styles.tableCell, style: { width: 130 }, children: editingRowId === item.id ? (_jsxs(Space, { size: 'small', children: [_jsx(Button, { type: 'primary', size: 'small', onClick: () => void handleSaveRow(item.id), loading: saving, children: "\u4FDD\u5B58" }), _jsx(Button, { size: 'small', onClick: handleCancelRow, children: "\u53D6\u6D88" })] })) : (_jsx(Button, { size: 'small', onClick: () => handleEditRow(item), disabled: editingRowId !== null || saving, children: "\u7F16\u8F91" })) })] }, String(item.id)));
                                            }) }) })] }) })] })] }) }));
};
export default TableEditRow;
