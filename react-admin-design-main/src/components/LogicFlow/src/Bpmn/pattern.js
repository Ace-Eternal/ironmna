import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function BpmnPattern(props) {
    const { lf } = props;
    function addStartNode() {
        lf.dnd.startDrag({
            type: 'bpmn:startEvent',
            text: '开始'
        });
    }
    function addUserTask() {
        lf.dnd.startDrag({
            type: 'bpmn:userTask'
        });
    }
    function addServiceTask() {
        lf.dnd.startDrag({
            type: 'bpmn:serviceTask'
        });
    }
    function addGateWay() {
        lf.dnd.startDrag({
            type: 'bpmn:exclusiveGateway'
        });
    }
    function addEndNode() {
        lf.dnd.startDrag({
            type: 'bpmn:endEvent',
            text: '结束'
        });
    }
    function openSelection() {
        lf.updateEditConfig({
            stopMoveGraph: true
        });
    }
    lf &&
        lf.on('selection:selected', () => {
            lf.updateEditConfig({
                stopMoveGraph: false
            });
        });
    return (_jsxs("div", { className: 'pattern', children: [_jsx("div", { className: 'pattern-selection', onMouseDown: () => openSelection() }), _jsx("div", { children: "\u9009\u533A" }), _jsx("div", { className: 'pattern-start', onMouseDown: () => addStartNode() }), _jsx("div", { children: "\u5F00\u59CB" }), _jsx("div", { className: 'pattern-user', onMouseDown: () => addUserTask() }), _jsx("div", { children: "\u7528\u6237\u4EFB\u52A1" }), _jsx("div", { className: 'pattern-user', onMouseDown: () => addServiceTask() }), _jsx("div", { children: "\u7CFB\u7EDF\u4EFB\u52A1" }), _jsx("div", { className: 'pattern-condition', onMouseDown: () => addGateWay() }), _jsx("div", { children: "\u6761\u4EF6\u5224\u65AD" }), _jsx("div", { className: 'pattern-end', onMouseDown: () => addEndNode() }), _jsx("div", { children: "\u7ED3\u675F" })] }));
}
