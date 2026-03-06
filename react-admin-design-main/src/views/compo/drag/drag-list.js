import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageWrapper } from '@/components/Page';
import { cloneDeep } from 'lodash-es';
import { SORTABLE_PLUGIN } from '@/settings/websiteSetting';
import { ReactSortable } from 'react-sortablejs';
const DragList = () => {
    const [listOne, setListOne] = useState([
        { name: 'ECMAScript6', id: 1 },
        { name: 'VueJS', id: 2 },
        { name: 'ReactJS', id: 3 },
        { name: 'AngularJS', id: 4 },
        { name: 'Webpack', id: 5 }
    ]);
    const [listTwo, setListTwo] = useState([
        { name: 'NodeJS', id: 6 },
        { name: 'TypeScript', id: 7 }
    ]);
    const [dragLogs, setDragLogs] = useState(['列表1 => 列表2, 6 => 1', '列表1 => 列表2, 6 => 2']);
    const handleDrop = (event) => {
        const listMap = new Map([
            ['list1', '列表1'],
            ['list2', '列表2']
        ]);
        const fromClsName = event.from.className;
        const toClsName = event.to.className;
        const from = listMap.get(fromClsName);
        const to = listMap.get(toClsName);
        const newDrapLogs = cloneDeep(dragLogs);
        newDrapLogs.push(`${from} => ${to}, ${event.oldIndex + 1} => ${event.newIndex + 1}`);
        setDragLogs(newDrapLogs);
    };
    return (_jsx(PageWrapper, { plugin: SORTABLE_PLUGIN, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 5, children: _jsx(Card, { title: '\u5217\u88681\u4E8B\u9879', bordered: false, bodyStyle: { height: '520px' }, children: _jsx(ReactSortable, { list: listOne, setList: setListOne, onEnd: handleDrop, group: 'list', className: 'list1', style: { height: '100%' }, children: listOne.map(item => (_jsx(Card, { hoverable: true, size: 'small', style: { marginBottom: '12px' }, children: item.name }, item.id))) }) }) }), _jsx(Col, { span: 5, children: _jsx(Card, { title: '\u5217\u88682\u4E8B\u9879', bordered: false, bodyStyle: { height: '520px' }, children: _jsx(ReactSortable, { list: listTwo, setList: setListTwo, onEnd: handleDrop, group: 'list', className: 'list2', style: { height: '100%' }, children: listTwo.map(item => (_jsx(Card, { hoverable: true, size: 'small', style: { marginBottom: '12px' }, children: item.name }, item.id))) }) }) }), _jsx(Col, { span: 4, children: _jsx(Card, { title: '\u64CD\u4F5C\u8BB0\u5F55', bordered: false, bodyStyle: { height: '520px' }, children: dragLogs.map(item => {
                            return (_jsx("p", { style: { marginBottom: '8px' }, children: item }, item));
                        }) }) }), _jsx(Col, { span: 5, children: _jsx(Card, { title: '\u5217\u88681\u6570\u636E', bordered: false, bodyStyle: { height: '520px' }, children: _jsx("pre", { children: JSON.stringify(listOne.map(({ name, id }) => ({ name, id })), null, 2) }) }) }), _jsx(Col, { span: 5, children: _jsx(Card, { title: '\u5217\u88682\u6570\u636E', bordered: false, bodyStyle: { height: '520px' }, children: _jsx("pre", { children: JSON.stringify(listTwo.map(({ name, id }) => ({ name, id })), null, 2) }) }) })] }) }));
};
export default DragList;
