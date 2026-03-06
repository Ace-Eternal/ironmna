import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Card, Transfer, Table, Tree } from 'antd';
import { PageWrapper } from '@/components/Page';
import { TRANSFER_COMPO } from '@/settings/websiteSetting';
import { mockData, treeData, transferDataSource } from './data';
const TransferPage = () => {
    const [targetKeys, setTargetKeys] = useState(['1', '5']);
    const [selectedKeys, setSelectedKeys] = useState(['2', '6']);
    const [treeTargetKeys, setTreeTargetKeys] = useState([]);
    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };
    const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
    const generateTree = (treeNodes = [], checkedKeys = []) => treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys)
    }));
    const handleChange = (nextTargetKeys) => {
        setTreeTargetKeys(nextTargetKeys);
    };
    const getRowSelection = ({ selectedKeys, onItemSelectAll, onItemSelect }) => {
        return {
            onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
                onItemSelectAll(treeSelectedKeys, selected);
            },
            onSelect({ key }, selected) {
                onItemSelect(key, selected);
            },
            selectedRowKeys: selectedKeys
        };
    };
    return (_jsx(PageWrapper, { plugin: TRANSFER_COMPO, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 8, children: _jsx(Card, { title: '\u57FA\u7840\u7528\u6CD5', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Transfer, { targetKeys: targetKeys, selectedKeys: selectedKeys, dataSource: mockData, render: item => item.title, listStyle: { width: '230px', height: '360px' }, locale: { itemsUnit: '项 ' }, onChange: onChange, onSelectChange: onSelectChange }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u6811\u7A7F\u68AD\u6846', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Transfer, { targetKeys: treeTargetKeys, dataSource: transferDataSource, render: item => item.title, showSelectAll: false, listStyle: { width: '230px', height: '360px' }, onChange: handleChange, children: ({ direction, selectedKeys, onItemSelect }) => {
                                if (direction === 'left') {
                                    const treeCheckedKeys = [...selectedKeys, ...treeTargetKeys];
                                    return (_jsx(Tree, { blockNode: true, checkable: true, checkStrictly: true, defaultExpandAll: true, checkedKeys: treeCheckedKeys, treeData: generateTree(treeData, treeTargetKeys), onCheck: (_, { node: { key } }) => {
                                            // onItemSelect(key as string, !isChecked(treeCheckedKeys, key as string))
                                        }, onSelect: (_, { node: { key } }) => {
                                            // onItemSelect(key as string, !isChecked(treeCheckedKeys, key as string))
                                        } }));
                                }
                            } }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u8868\u683C\u7A7F\u68AD\u6846', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Transfer, { targetKeys: targetKeys, dataSource: mockData, listStyle: { width: '230px', height: '360px' }, locale: { itemsUnit: '项 ' }, onChange: onChange, children: ({ filteredItems, selectedKeys, onItemSelectAll, onItemSelect }) => (_jsx(Table, { rowSelection: getRowSelection({ selectedKeys, onItemSelectAll, onItemSelect }), columns: [{ dataIndex: 'title', title: 'Name' }], dataSource: filteredItems, size: 'small', pagination: false, onRow: ({ key }) => ({
                                    onClick: () => {
                                        // onItemSelect(key, !selectedKeys.includes(key))
                                    }
                                }) })) }) }) })] }) }));
};
export default TransferPage;
