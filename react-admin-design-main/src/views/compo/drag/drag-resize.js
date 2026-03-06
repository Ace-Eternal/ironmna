import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from 'antd';
import { PageWrapper } from '@/components/Page';
import { REACT_RND_PLUGIN } from '@/settings/websiteSetting';
import { Rnd } from 'react-rnd';
const DragResize = () => {
    const [config, setConfig] = useState({
        x: 650,
        y: 130,
        width: 180,
        height: 180
    });
    const handleDragStop = (_e, data) => {
        setConfig({
            ...config,
            x: data.x,
            y: data.y
        });
    };
    const handleResize = (_e, _direction, ref, _delta, position) => {
        setConfig({
            ...config,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position
        });
    };
    return (_jsx(PageWrapper, { plugin: REACT_RND_PLUGIN, children: _jsx(Card, { bordered: false, bodyStyle: { padding: 0 }, children: _jsx("div", { style: { width: '100%', height: '500px' }, children: _jsx(Rnd, { size: { width: config.width, height: config.height }, position: { x: config.x, y: config.y }, minWidth: 100, minHeight: 100, onDragStop: handleDragStop, onResize: handleResize, bounds: 'parent', style: { background: '#1890ff' }, children: _jsx("div", { className: 'flex-center', style: { height: '100%' }, children: _jsxs("div", { style: { width: '90px', color: '#fff' }, children: [_jsxs("p", { children: ["x: ", config.x] }), _jsxs("p", { children: ["y: ", config.y] }), _jsxs("p", { children: ["width: ", config.width] }), _jsxs("p", { children: ["height: ", config.height] })] }) }) }) }) }) }));
};
export default DragResize;
