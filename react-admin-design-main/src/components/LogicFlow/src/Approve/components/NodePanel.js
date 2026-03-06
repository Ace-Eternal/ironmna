import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { approveNodes } from '../config';
export default function NodePanel(lf) {
    // 拖拽创建
    const dragNode = (item) => {
        lf.dnd.startDrag({
            type: item.type,
            text: item.label
        });
    };
    // 节点菜单
    const getNodePanel = () => {
        const nodeList = [];
        approveNodes.forEach((item, key) => {
            nodeList.push(_jsxs("div", { className: `approve-node node-${item.type}`, children: [_jsx("div", { className: 'node-shape', style: { ...item.style }, onMouseDown: () => dragNode(item) }), _jsx("div", { className: 'node-label', children: item.label })] }, key));
        });
        return nodeList;
    };
    return getNodePanel();
}
