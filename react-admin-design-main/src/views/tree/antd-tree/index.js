import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Card, Tree } from 'antd';
import { TREE_COMPO } from '@/settings/websiteSetting';
import { PageWrapper } from '@/components/Page';
import { treeData } from './data';
const initTreeData = [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true }
];
const AntdTree = () => {
    const [lazyTreeData, setLazyTreeData] = useState(initTreeData);
    function handleLoadData(treeNode) {
        return new Promise(resolve => {
            if (treeNode.dataRef.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.eventKey}-1` }
                ];
                setLazyTreeData([...lazyTreeData]);
                resolve();
            }, 1000);
        });
    }
    function handleDrop() { }
    return (_jsx(PageWrapper, { plugin: TREE_COMPO, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 8, children: _jsx(Card, { title: '\u53EF\u9009\u62E9\u8282\u70B9', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Tree, { treeData: treeData, checkable: true, defaultExpandAll: true }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u61D2\u52A0\u8F7D\u8282\u70B9', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Tree, { checkable: true, treeData: lazyTreeData, loadData: handleLoadData }) }) }), _jsx(Col, { span: 8, children: _jsx(Card, { title: '\u53EF\u62D6\u62FD\u8282\u70B9', bordered: false, bodyStyle: { height: '420px' }, children: _jsx(Tree, { treeData: treeData, draggable: true, blockNode: true, defaultExpandAll: true, onDrop: handleDrop }) }) })] }) }));
};
export default AntdTree;
