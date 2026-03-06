import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { message } from 'antd';
import LogicFlow from '@logicflow/core';
import PropertyPanel from './components/property';
import NodePanel from './components/NodePanel';
import RegisteNode from './components/registerNode';
import { themeApprove, data } from './config';
import '@logicflow/core/dist/style/index.css';
import './index.css';
const config = {
    stopScrollGraph: true,
    stopZoomGraph: true,
    grid: {
        size: 10,
        visible: true,
        type: 'mesh',
        config: {
            color: '#DCDCDC' // 设置网格的颜色
        }
    },
    keyboard: { enabled: true },
    style: themeApprove
};
export default function ApproveExample() {
    const [lf, setLf] = useState({});
    const [nodeData, setNodeData] = useState();
    useEffect(() => {
        const lf = new LogicFlow({
            ...config,
            container: document.querySelector('#graphApprove')
        });
        setLf(lf);
        RegisteNode(lf);
        lf.render(data);
        initEvent(lf);
    }, []);
    const initEvent = (lf) => {
        lf.on('element:click', ({ data }) => {
            setNodeData(data);
            console.log(JSON.stringify(lf.getGraphData()));
        });
        lf.on('connection:not-allowed', (data) => {
            message.error(data.msg);
        });
    };
    // 更新属性
    const updateProperty = (id, data) => {
        const node = lf.graphModel.nodesMap[id];
        const edge = lf.graphModel.edgesMap[id];
        if (node) {
            node.model.setProperties(Object.assign(node.model.properties, data));
        }
        else if (edge) {
            edge.model.setProperties(Object.assign(edge.model.properties, data));
        }
    };
    // 隐藏属性面板
    const hidePropertyPanel = () => {
        setNodeData(undefined);
    };
    return (_jsxs("div", { className: 'approve-example-container', children: [_jsx("div", { className: 'node-panel', children: NodePanel(lf) }), _jsx("div", { id: 'graphApprove', className: 'viewport' }), nodeData ? (_jsx("div", { className: 'property-panel', children: PropertyPanel(nodeData, updateProperty, hidePropertyPanel) })) : ('')] }));
}
