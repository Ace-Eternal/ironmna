import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Button, Table, Select, Switch, InputNumber, Input, DatePicker, Radio, Checkbox, Card, Popconfirm, Space } from 'antd';
import { PageWrapper } from '@/components/Page';
import dayjs from 'dayjs';
import { TABLE_EDIT_COMPO } from '@/settings/websiteSetting';
import { tableData } from './data';
const theadMap = {
    key: { title: '数字输入框', type: 'number' },
    name: { title: '输入框', type: 'text' },
    sex: { title: '单选框', type: 'radio' },
    birth: { title: '日期选择框', type: 'date' },
    education: { title: '选择器', type: 'select' },
    hobby: { title: '多选框', type: 'checkbox' },
    forbid: { title: '开关', type: 'switch' },
    action: { title: '按钮', type: 'button' }
};
const nodeType = (type, record) => {
    switch (type) {
        case 'number':
            return _jsx(InputNumber, { min: 1000, max: 2000 });
        case 'text':
            return _jsx(Input, {});
        case 'radio':
            return _jsx(Radio.Group, { options: ['男', '女'].map(item => ({ value: item, label: item })) });
        case 'date':
            return (_jsx("div", { children: _jsx(DatePicker, { defaultValue: dayjs(record.birth, 'YYYY-MM-DD'), format: 'YYYY-MM-DD' }) }));
        case 'select':
            return (_jsx(Select, { options: ['初中', '高中', '大专', '本科'].map(item => ({ value: item })), style: { width: '80px' } }));
        case 'checkbox':
            return _jsx(Checkbox.Group, { options: record.hobby.split('、'), defaultValue: record.hobby.split('、') });
        case 'switch':
            return _jsx(Switch, { defaultChecked: record.forbid });
    }
};
const EditableCell = ({ editing, dataIndex, cellType, record, children, ...restProps }) => {
    const cellNode = nodeType(cellType, record);
    return (_jsx("td", { ...restProps, children: editing ? (_jsx(Form.Item, { name: dataIndex, style: { margin: 0 }, children: cellNode })) : (children) }));
};
const TableEditRow = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(tableData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = (await form.validateFields());
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
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
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u7F16\u53F7" }), _jsx("p", { className: 'sub-title' })] }));
            },
            dataIndex: 'id',
            width: 70,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u957F" }), _jsx("p", { className: 'sub-title', children: "\u6BEB\u7C73" })] }));
            },
            dataIndex: 'orderItemList.length',
            width: 70,
            //   editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u7F16\u53F7" }), _jsx("p", { className: 'sub-title', children: "(\u6570\u5B57\u8F93\u5165\u6846)" })] }));
            },
            dataIndex: 'key',
            width: 70,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u59D3\u540D" }), _jsx("p", { className: 'sub-title', children: "(\u8F93\u5165\u6846)" })] }));
            },
            dataIndex: 'name',
            width: 110,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u6027\u522B" }), _jsx("p", { className: 'sub-title', children: "(\u5355\u9009\u6846)" })] }));
            },
            dataIndex: 'sex',
            width: 120,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u751F\u65E5" }), _jsx("p", { className: 'sub-title', children: "(\u65E5\u671F\u9009\u62E9\u5668)" })] }));
            },
            dataIndex: 'birth',
            width: 140,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u5B66\u5386" }), _jsx("p", { className: 'sub-title', children: "(\u9009\u62E9\u5668)" })] }));
            },
            dataIndex: 'education',
            width: 80,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u7231\u597D" }), _jsx("p", { className: 'sub-title', children: "(\u591A\u9009\u6846)" })] }));
            },
            dataIndex: 'hobby',
            width: 250,
            editable: true,
            align: 'center'
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u7981\u6B62\u7F16\u8F91" }), _jsx("p", { className: 'sub-title', children: "(\u5F00\u5173)" })] }));
            },
            dataIndex: 'forbid',
            width: 70,
            editable: true,
            align: 'center',
            render: (text, record) => {
                return _jsx("span", { children: record.forbid ? '是' : '否' });
            }
        },
        {
            title: () => {
                return (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u64CD\u4F5C" }), _jsx("p", { className: 'sub-title', children: "(\u6309\u94AE)" })] }));
            },
            dataIndex: 'action',
            width: 70,
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (_jsxs(Space, { children: [_jsx(Button, { type: 'primary', ghost: true, onClick: () => save(record.key), children: "\u4FDD\u5B58" }), _jsx(Popconfirm, { title: '\u662F\u5426\u53D6\u6D88\u7F16\u8F91\uFF1F', onConfirm: cancel, children: _jsx(Button, { type: 'primary', danger: true, ghost: true, children: "\u53D6\u6D88" }) })] })) : (_jsx(Button, { disabled: editingKey !== '', onClick: () => edit(record), children: "\u7F16\u8F91" }));
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
    return (_jsx(PageWrapper, { plugin: TABLE_EDIT_COMPO, children: _jsx(Card, { bordered: false, children: _jsx(Form, { form: form, component: false, children: _jsx(Table, { components: {
                        body: {
                            cell: EditableCell
                        }
                    }, dataSource: data, columns: mergedColumns, pagination: false }) }) }) }));
};
export default TableEditRow;
