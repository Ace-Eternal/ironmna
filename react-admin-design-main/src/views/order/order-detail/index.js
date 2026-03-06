import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Form, Button, Table, Select, InputNumber, Input, Card, Popconfirm, Space, Tag } from 'antd';
import { PageWrapper } from '@/components/Page';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDownloadUrl } from '@/api';
import { message } from 'antd';
import { FORM_COMPO } from '@/settings/websiteSetting';
import { getBaseUrl } from '@/types/config';
const theadMap = {
    key: { title: '数字输入框', type: 'number' },
    val: { title: '输入框', type: 'text' },
    birth: { title: '日期选择框', type: 'date' },
    type_select: { title: '选择器', type: 'type_select' },
    steel_type: { title: '选择器', type: 'steel_type_select' },
    length: { title: '输入框', type: 'text' },
    length_remain: { title: '输入框', type: 'text' },
    width: { title: '输入框', type: 'text' },
    width_remain: { title: '输入框', type: 'text' },
    thickness: { title: '输入框', type: 'text' },
    thickness_remain: { title: '输入框', type: 'text' },
    amount: { title: '输入框', type: 'text' },
    monovalent: { title: '输入框', type: 'text' },
    total_weight: { title: '输入框', type: 'text' },
    steel_money: { title: '输入框', type: 'text' },
    cut_fee: { title: '输入框', type: 'text' },
    forbid: { title: '开关', type: 'switch' },
    action: { title: '按钮', type: 'button' }
};
const nodeType = (type, record) => {
    switch (type) {
        case 'number':
            return _jsx(InputNumber, { min: 1000, max: 2000 });
        case 'text':
            return _jsx(Input, {});
        case 'type_select':
            return _jsx(Select, { options: ['方钢', '圆钢'].map(item => ({ value: item })), style: { width: '80px' } });
        case 'steel_type_select':
            return (_jsx(Select, { options: [
                    '45#',
                    '50#',
                    'P20',
                    'P20H',
                    '718',
                    '718H',
                    'H13',
                    'H13R',
                    '40Cr',
                    '4Cr13',
                    'Cr12',
                    'Cr12正材',
                    '2083',
                    'S136',
                    'S136H',
                    'NAK80',
                    'Cr12MoV',
                    'SKD61',
                    'SKD11',
                    'DC53'
                ].map(item => ({ value: item })), style: { width: '80px' } }));
        // case 'checkbox':
        //   return <Checkbox.Group options={record.hobby.split('、')} defaultValue={record.hobby.split('、')} />
        // case 'switch':
        //   return <Switch defaultChecked={record.forbid} />
    }
};
const EditableCell = ({ editing, dataIndex, cellType, record, children, ...restProps }) => {
    const cellNode = nodeType(cellType, record);
    return (_jsx("td", { ...restProps, children: editing ? (_jsx(Form.Item, { name: dataIndex, style: { margin: 0 }, children: cellNode })) : (children) }));
};
const TableEditRow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetail } = location.state || [];
    console.log('here is order-detail.tsx');
    console.log(orderDetail);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = (await form.validateFields());
            const newData = [...data];
            const index = newData.findIndex(item => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                setData(newData);
                setEditingKey('');
            }
            else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        }
        catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    // @ts-ignore
    const columns = [
        // {
        //   title: () => {
        //     return (
        //       <>
        //         <span>编号</span>
        //         <p className='sub-title'></p>
        //       </>
        //     )
        //   },
        //   dataIndex: 'id',
        //   width: 70,
        //   align: 'center'
        // },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u7C7B\u578B" }), _jsx("p", { className: 'sub-title' })] }));
            },
            dataIndex: 'type',
            width: 110
            // editable: true
        },
        {
            title: () => {
                return (_jsx(_Fragment, { children: _jsx("span", { children: "\u94A2\u53F7" }) }));
            },
            dataIndex: 'steel_type',
            width: 80,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u957F" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'length',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u4F59\u91CF" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'length_remain',
            width: 80,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u5BBD" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'width',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u4F59\u91CF" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'width_remain',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u539A/\u76F4\u5F84" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'thickness',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u4F59\u91CF" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'thickness_remain',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u4EF6\u6570" }), _jsx("p", { className: 'sub-title' })] }));
            },
            dataIndex: 'amount',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u5355\u4EF7" }), _jsx("p", { className: 'orderItemList.sub-title', children: "\u5143/\u5343\u514B" })] }));
            },
            dataIndex: 'monovalent',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u91CD\u91CF" }), _jsx("p", { className: 'sub-title', children: "\u5343\u514B" })] }));
            },
            dataIndex: 'total_weight',
            width: 70,
            // editable: false,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u5200\u8D39" }), _jsx("p", { className: 'sub-title', children: "\u5143" })] }));
            },
            dataIndex: 'cut_fee',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u6750\u6599\u91D1\u989D" }), _jsx("p", { className: 'sub-title', children: "\u5DF2\u7B97\u5200\u8D39" })] }));
            },
            dataIndex: 'steel_money',
            width: 70,
            // editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsx(_Fragment, { children: _jsx("span", { children: "\u64CD\u4F5C" }) }));
            },
            dataIndex: 'action',
            width: 70,
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (_jsxs(Space, { children: [_jsx(Button, { type: 'primary', ghost: true, onClick: () => save(record.id), children: "\u4FDD\u5B58" }), _jsx(Popconfirm, { title: '\u662F\u5426\u53D6\u6D88\u7F16\u8F91\uFF1F', onConfirm: cancel, children: _jsx(Button, { type: 'primary', danger: true, ghost: true, children: "\u53D6\u6D88" }) })] })) : (_jsx(Button, { disabled: editingKey !== '', onClick: () => edit(record), children: "\u7F16\u8F91" }));
            }
        }
    ];
    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                cellType: theadMap[col.dataIndex].type,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });
    const url = getBaseUrl();
    function handleExportOrder(id) {
        getDownloadUrl(id)
            .then(res => {
            console.log('here is res');
            console.log(res);
            if (res) {
                // ✅ 1. 检查链接是否正确
                const filename = JSON.stringify(res).replace(/"/g, '').trim();
                const downloadUrl = url + '/order/download?file=' + filename;
                window.open(downloadUrl, '_blank');
            }
            else {
                throw new Error('未获取到下载链接');
            }
        })
            .then(() => {
            message.success('文件下载已开始！');
        })
            .catch((error) => {
            message.error(`导出失败: ${error.message}`);
            console.error('导出错误:', error);
        });
    }
    // 如果没有数据（直接访问详情页），可以跳转回列表页
    useEffect(() => {
        if (!orderDetail) {
            navigate('/order/order-basic');
        }
        else {
            setData([orderDetail]);
            console.log('here is data');
            console.log(data);
        }
    }, [orderDetail, navigate]);
    if (!orderDetail) {
        return null;
    }
    return (_jsx(PageWrapper, { plugin: FORM_COMPO, children: _jsxs(_Fragment, { children: [_jsx(Card, { title: '\u8BA2\u5355\u4FE1\u606F', bordered: false, style: { marginBottom: 16 }, children: _jsxs(Space, { size: 20, children: [_jsxs(Tag, { color: 'blue', children: ["\u8BA2\u5355\u53F7: ", orderDetail.id] }), _jsxs(Tag, { color: 'green', children: ["\u5BA2\u6237: ", orderDetail.customer?.customer_name] }), _jsxs(Tag, { color: 'orange', children: ["\u7535\u8BDD: ", orderDetail.customer?.telephone] }), _jsxs(Tag, { color: 'yellow', children: ["\u4E0B\u5355\u65F6\u95F4: ", orderDetail.time] }), _jsxs("div", { children: [" \u52A0\u5DE5\u8D39: ", orderDetail.process_fee] }), _jsxs("div", { color: 'purple', children: ["\u8D26\u5355\u603B\u91D1\u989D: \u00A5", orderDetail.total_money.toFixed(2)] }), _jsx(Button, { type: 'primary', onClick: () => handleExportOrder(orderDetail.id), children: "\u5BFC\u51FA\u8D26\u5355" })] }) }), _jsx(Card, { bordered: false, children: _jsx(Form, { form: form, component: false, children: _jsx(Table, { components: {
                                body: {
                                    cell: EditableCell
                                }
                            }, dataSource: orderDetail.orderItemList, columns: mergedColumns, pagination: false }) }) })] }) }));
};
export default TableEditRow;
