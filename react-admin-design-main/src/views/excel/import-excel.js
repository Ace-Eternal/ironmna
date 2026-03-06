import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Table, Upload, Space, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { PageWrapper } from '@/components/Page';
import { XLSX_PLUGIN } from '@/settings/websiteSetting';
import { useExcel } from './useExcel';
const ImportExcel = () => {
    const { Dragger } = Upload;
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const { readDataFromExcel } = useExcel();
    function handleChange(fileParam) {
        const { file } = fileParam;
        const rawFile = file.originFileObj;
        if (!rawFile)
            return;
        if (!/\.(xlsx|xls|csv)$/.test(rawFile.name)) {
            message.warning('Excel文件只支持.xlsx, .xls, .csv格式!');
            return;
        }
        const isLimit1M = rawFile.size / 1024 / 1024 < 1;
        if (!isLimit1M) {
            message.warning('上传的Excel文件大小不能超过1M!');
            return;
        }
        readFile(rawFile);
    }
    function readFile(rawFile) {
        const reader = new FileReader();
        reader.onload = e => {
            const data = e.target && e.target.result;
            const { header, results } = readDataFromExcel(data, 'array');
            const columns = header.map(key => ({ title: key, dataIndex: key, align: 'center' }));
            setTableColumns(columns);
            setTableData(results);
        };
        reader.readAsArrayBuffer(rawFile);
        reader.onerror = () => {
            message.error('Excel文件读取出错!');
        };
    }
    return (_jsx(PageWrapper, { plugin: XLSX_PLUGIN, children: _jsx(Card, { bordered: false, children: _jsxs(Space, { direction: 'vertical', size: 16, style: { width: '100%' }, children: [_jsxs(Dragger, { accept: '.xlsx, .xls, .csv', showUploadList: false, maxCount: 1, onChange: handleChange, children: [_jsx("p", { className: 'ant-upload-drag-icon', style: { marginBottom: 0 }, children: _jsx(CloudUploadOutlined, { rev: undefined }) }), _jsxs("p", { children: ["\u5C06Excel\u6587\u4EF6\u62D6\u5230\u6B64\u5904, \u6216", _jsx("span", { style: { color: '#1890ff' }, children: "\u70B9\u51FB\u4E0A\u4F20" })] })] }), _jsx(Table, { dataSource: tableData, columns: tableColumns, pagination: false })] }) }) }));
};
export default ImportExcel;
