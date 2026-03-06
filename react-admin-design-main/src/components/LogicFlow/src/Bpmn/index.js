import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Component } from 'react';
import LogicFlow from '@logicflow/core';
import { BpmnElement, Control, Menu, SelectionSelect } from '@logicflow/extension';
import BpmnPattern from './pattern';
import './index.css';
import '@logicflow/extension/lib/style/index.css';
const config = {
    stopScrollGraph: true,
    stopZoomGraph: true,
    metaKeyMultipleSelected: true,
    grid: {
        size: 10,
        type: 'dot'
    },
    keyboard: {
        enabled: true
    },
    snapline: true
};
export default class BpmnExample extends Component {
    lf = null;
    constructor(props) {
        super(props);
        this.state = {
            rendered: true
        };
    }
    componentDidMount() {
        LogicFlow.use(BpmnElement);
        LogicFlow.use(Control);
        LogicFlow.use(Menu);
        LogicFlow.use(SelectionSelect);
        const lf = new LogicFlow({
            ...config,
            container: document.querySelector('#graphBpmn')
        });
        lf.render();
        this.lf = lf;
        this.setState({
            rendered: true
        });
    }
    render() {
        const { rendered } = this.state;
        let tools;
        if (rendered) {
            tools = (_jsx("div", { children: _jsx(BpmnPattern, { lf: this.lf }) }));
        }
        return (_jsx(_Fragment, { children: _jsxs("div", { className: 'bpmn-example-container', children: [_jsx("div", { id: 'graphBpmn', className: 'viewport' }), tools] }) }));
    }
}
