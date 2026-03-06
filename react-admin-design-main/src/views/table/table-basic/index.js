import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Switch, Popover, Space, Modal, Form, Input, Select, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TABLE_COMPO } from '@/settings/websiteSetting';
import { getTableList } from '@/api';
import { PageWrapper } from '@/components/Page';
const marriedOptions = [
    { label: '单身', value: 0 },
    { label: '未婚', value: 1 },
    { label: '已婚', value: 2 },
    { label: '离异', value: 3 }
];
const TableBasic = () => {
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [tableQuery, setTableQuery] = useState({ current: 1, pageSize: 10 });
    const [form] = Form.useForm();
    const [modalVisibel, setModalVisibel] = useState(false);
    const [editHobbys, setEditHobbys] = useState([]);
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center',
            sorter: true
        },
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            render: (_, record) => {
                const content = (_jsxs("div", { children: [_jsxs("p", { children: ["\u59D3\u540D: ", record.name] }), _jsxs("p", { children: ["\u624B\u673A: ", record.phone] }), _jsxs("p", { children: ["\u7231\u597D: ", record.hobby.join('、')] })] }));
                return (_jsx(Popover, { content: content, children: _jsx(Tag, { color: 'blue', children: record.name }) }));
            }
        },
        {
            title: '性别',
            dataIndex: 'sex',
            align: 'center'
        },
        {
            title: '手机',
            dataIndex: 'phone',
            align: 'center'
        },
        {
            title: '学历',
            dataIndex: 'education',
            align: 'center'
        },
        {
            title: '婚姻状况',
            dataIndex: 'married',
            align: 'center',
            render: (text, record) => (_jsx(Select, { options: marriedOptions, defaultValue: record.married, onChange: value => (record.married = value) }))
        },
        {
            title: '禁止编辑',
            dataIndex: 'forbid',
            align: 'center',
            render: (_, record) => (_jsx(Switch, { defaultChecked: record.forbid, onChange: checked => (record.forbid = checked) }))
        },
        {
            title: '爱好',
            dataIndex: 'hobby',
            align: 'center',
            render: (_, record) => _jsx("span", { children: record.hobby.join('、') })
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { disabled: record.forbid, onClick: () => handleEdit(record), children: "\u7F16\u8F91" }), _jsx(Button, { danger: true, onClick: handleDelete, children: "\u5220\u9664" })] }))
        }
    ];
    const tableSelection = {
        onChange: (selectedRowKeys) => {
            console.log(selectedRowKeys);
        }
    };
    useEffect(() => {
        fetchData();
    }, [tableQuery]);
    async function fetchData() {
        setTableLoading(true);
        const data = await getTableList(tableQuery);
        const { list, total } = data;
        setTableData(list);
        setTableTotal(total);
        setTableLoading(false);
    }
    function handlePageChange(page, pageSize) {
        setTableQuery({ ...tableQuery, current: page, pageSize });
    }
    function handleDelete() {
        Modal.confirm({
            title: '此操作将删除选中数据, 是否继续?',
            icon: _jsx(ExclamationCircleOutlined, { rev: undefined }),
            // okType: 'danger',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }
    function handleEdit(record) {
        form.setFieldsValue({ ...record });
        setEditHobbys(record.hobby);
        setModalVisibel(true);
    }
    function handleConfirm() {
        // 调用接口
        setModalVisibel(false);
    }
    function handleCancle() {
        setEditHobbys([]);
        setModalVisibel(false);
    }
    return (_jsx(PageWrapper, { plugin: TABLE_COMPO, children: _jsxs(Card, { bordered: false, children: [_jsx(Table, { rowKey: 'id', rowSelection: tableSelection, columns: columns, dataSource: tableData, loading: tableLoading, pagination: {
                        current: tableQuery.current,
                        pageSize: tableQuery.pageSize,
                        total: tableTotal,
                        showTotal: () => `Total ${tableTotal} items`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handlePageChange
                    } }), _jsx(Modal, { open: modalVisibel, title: '\u7F16\u8F91', width: '600px', okText: '\u786E\u5B9A', cancelText: '\u53D6\u6D88', onCancel: handleCancle, onOk: handleConfirm, children: _jsxs(Form, { form: form, colon: false, labelCol: { span: 4 }, labelAlign: 'left', style: { width: '80%', margin: '0 auto' }, children: [_jsx(Form.Item, { label: '\u59D3\u540D', name: 'name', children: _jsx(Input, { disabled: true }) }), _jsx(Form.Item, { label: '\u624B\u673A', name: 'phone', children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801' }) }), _jsx(Form.Item, { label: '\u5B66\u5386', name: 'education', children: _jsx(Select, { options: ['初中', '高中', '大专', '本科'].map(item => ({ value: item })) }) }), _jsx(Form.Item, { label: '\u7231\u597D', name: 'hobby', children: _jsx(Checkbox.Group, { options: editHobbys.map(item => ({ label: item, value: item })) }) })] }) })] }) }));
};
export default TableBasic;
