import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Button, Card, Input, Radio, Select, Table, Space, message } from 'antd';
import { PageWrapper } from '@/components/Page';
import { XLSX_PLUGIN } from '@/settings/websiteSetting';
import { useExcel } from '../useExcel';
import { tableData } from './data';
const ExportExcel = () => {
    const { Item } = Form;
    const { Group } = Radio;
    const { exportDataToExcel } = useExcel();
    const formParam = {
        fileName: '',
        autoWidth: true,
        fileType: 'xlsx'
    };
    const tableColumns = [
        { title: '编号', dataIndex: 'key', align: 'center' },
        { title: '姓名', dataIndex: 'name', align: 'center' },
        { title: '性别', dataIndex: 'sex', align: 'center' },
        { title: '手机', dataIndex: 'phone', align: 'center' },
        { title: '学历', dataIndex: 'education', align: 'center' },
        { title: '爱好', dataIndex: 'hobby', align: 'center' }
    ];
    const [tableSelectedKeys, setTableSelectedKeys] = useState([]);
    const [tableSelectedRows, setTableSelectedRows] = useState([]);
    function handleTableChange(selectedKeys) {
        setTableSelectedKeys(selectedKeys);
    }
    function handleTableSelect(_record, _selected, selectedRows) {
        setTableSelectedRows(selectedRows);
    }
    function handleTableSelectAll(_selected, selectedRows) {
        setTableSelectedRows(selectedRows);
    }
    function handleExport(values) {
        console.log('values', values);
        if (!tableSelectedRows.length) {
            message.warning('请勾选要导出的数据项！');
            return;
        }
        const { fileName, autoWidth, fileType: bookType } = values;
        const params = {
            data: tableSelectedRows,
            header: ['编号', '姓名', '性别', '手机', '学历', '爱好'],
            key: ['key', 'name', 'sex', 'phone', 'education', 'hobby'],
            fileName,
            autoWidth,
            bookType
        };
        exportDataToExcel(params);
        setTableSelectedKeys([]);
        setTableSelectedRows([]);
    }
    return (_jsx(PageWrapper, { plugin: XLSX_PLUGIN, children: _jsx(Card, { bordered: false, children: _jsxs(Space, { direction: 'vertical', size: 16, style: { width: '100%' }, children: [_jsxs(Form, { layout: 'inline', autoComplete: 'off', initialValues: formParam, onFinish: handleExport, children: [_jsx(Item, { label: '\u6587\u4EF6\u540D:', name: 'fileName', children: _jsx(Input, { placeholder: '\u6587\u4EF6\u540D' }) }), _jsx(Item, { label: '\u81EA\u52A8\u5BBD\u5EA6:', name: 'autoWidth', children: _jsx(Group, { options: [
                                        { label: '自动', value: true },
                                        { label: '固定', value: false }
                                    ] }) }), _jsx(Item, { label: '\u6587\u4EF6\u7C7B\u578B:', name: 'fileType', children: _jsx(Select, { options: [
                                        { label: 'xlsx', value: 'xlsx' },
                                        { label: 'csv', value: 'csv' },
                                        { label: 'txt', value: 'txt' }
                                    ], style: { width: '180px' } }) }), _jsx(Item, { children: _jsx(Button, { type: 'primary', htmlType: 'submit', children: "\u5BFC\u51FAExcel" }) })] }), _jsx(Table, { dataSource: tableData, columns: tableColumns, rowSelection: {
                            selectedRowKeys: tableSelectedKeys,
                            onChange: handleTableChange,
                            onSelect: handleTableSelect,
                            onSelectAll: handleTableSelectAll
                        }, pagination: false })] }) }) }));
};
export default ExportExcel;
