import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Popover, Space, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TABLE_COMPO } from '@/settings/websiteSetting';
import { deleteCustomer, getTableList, updateCustomer } from '@/api';
import { PageWrapper } from '@/components/Page';
import { message } from 'antd';
const CustomerTable = () => {
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [tableQuery, setTableQuery] = useState({ current: 1, pageSize: 10 });
    const [form] = Form.useForm();
    const [modalVisibel, setModalVisibel] = useState(false);
    const columns = [
        // 这里显示必须遵循后端传过来的json里面的字段名字
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center',
            sorter: true
        },
        {
            title: '姓名',
            dataIndex: 'customer_name',
            align: 'center',
            render: (_, record) => {
                const content = (_jsxs("div", { children: [_jsxs("p", { children: ["\u59D3\u540D: ", record.customer_name] }), _jsxs("p", { children: ["\u624B\u673A: ", record.telephone] }), _jsxs("p", { children: ["\u5730\u5740: ", record.address] })] }));
                return (_jsx(Popover, { content: content, children: _jsx(Tag, { color: 'blue', children: record.customer_name }) }));
            }
        },
        {
            title: '手机',
            dataIndex: 'telephone',
            align: 'center'
        },
        {
            title: '地址',
            dataIndex: 'address',
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { disabled: record.forbid, onClick: () => handleEdit(record), children: "\u7F16\u8F91" }), _jsx(Button, { danger: true, onClick: () => handleDelete(record.id), children: "\u5220\u9664" })] }))
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
        const { records, total } = data;
        setTableData(records);
        setTableTotal(total);
        setTableLoading(false);
    }
    function handlePageChange(page, pageSize) {
        setTableQuery({ ...tableQuery, current: page, pageSize });
    }
    function handleDelete(id) {
        Modal.confirm({
            title: '此操作将删除选中数据, 是否继续?',
            icon: _jsx(ExclamationCircleOutlined, { rev: undefined }),
            // okType: 'danger',
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                try {
                    await deleteCustomer(id); // 传递对象 { id }
                    message.success('删除成功！'); // 成功消息
                    await fetchData();
                }
                catch (error) {
                    message.error(`删除失败`); // 失败消息
                }
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }
    function handleEdit(record) {
        form.setFieldsValue({ ...record });
        setModalVisibel(true);
    }
    function handleConfirm() {
        const formData = form.getFieldsValue();
        console.log('here is updateCustomer data');
        console.log(formData);
        updateCustomer(formData)
            .then(() => {
            // 成功时显示消息
            message.success('客户更新成功！');
            form.resetFields(); //（可选）成功后可重置表单
            fetchData();
        })
            .catch(error => {
            // 失败时显示错误信息
            message.error(`更新失败: ${error.message}`);
        });
        setModalVisibel(false);
    }
    function handleCancle() {
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
                    } }), _jsx(Modal, { open: modalVisibel, title: '\u7F16\u8F91', width: '600px', okText: '\u786E\u5B9A', cancelText: '\u53D6\u6D88', onCancel: handleCancle, onOk: handleConfirm, children: _jsxs(Form, { form: form, colon: false, labelCol: { span: 4 }, labelAlign: 'left', style: { width: '80%', margin: '0 auto' }, children: [_jsx(Form.Item, { label: '\u7F16\u53F7', name: 'id', children: _jsx(Input, { disabled: true }) }), _jsx(Form.Item, { label: '\u59D3\u540D', name: 'customer_name', children: _jsx(Input, { disabled: true }) }), _jsx(Form.Item, { label: '\u624B\u673A', name: 'telephone', children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801' }) }), _jsx(Form.Item, { label: '\u5730\u5740', name: 'address', children: _jsx(Input, { placeholder: '\u8BF7\u8F93\u5165\u5730\u5740' }) })] }) })] }) }));
};
export default CustomerTable;
