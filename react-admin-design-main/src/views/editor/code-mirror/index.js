import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { Card } from 'antd';
import { useDebounceFn } from 'ahooks';
import { PageWrapper } from '@/components/Page';
import { CODEMIRROR_PLUGIN } from '@/settings/websiteSetting';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Toolbar from './components/Toolbar';
import CodeInfo from './components/CodeInfo';
const CodeMirrorEditor = () => {
    const [codeVal, setCodeVal] = useState(`console.log('Hello, world!')`);
    const [config, setConfig] = useState({
        language: 'javascript',
        autoFocus: true,
        indentWithTab: true,
        height: '350px'
    });
    const [codeInfo, setCodeInfo] = useImmer({
        lines: null,
        cursor: null,
        selected: null,
        length: null
    });
    const { run: handleStateUpdate } = useDebounceFn((viewUpdate) => {
        const ranges = viewUpdate.state.selection.ranges;
        const lines = viewUpdate.state.doc.lines;
        const cursor = ranges[0].head;
        const selected = ranges.reduce((plus, range) => plus + range.to - range.from, 0);
        const length = viewUpdate.state.doc.length;
        setCodeInfo({
            lines,
            cursor,
            selected,
            length
        });
    }, { wait: 200 });
    const handleValueChange = useCallback((values) => {
        setConfig({ ...config, ...values });
    }, []);
    const handleChange = useCallback((value) => {
        setCodeVal(value);
    }, []);
    return (_jsx(PageWrapper, { plugin: CODEMIRROR_PLUGIN, children: _jsxs(Card, { bordered: false, children: [_jsx(Toolbar, { config: config, valueChange: handleValueChange }), _jsx(CodeMirror, { value: codeVal, height: config.height, autoFocus: config.autoFocus, indentWithTab: config.indentWithTab, style: {
                        borderLeft: 'solid 1px #ddd',
                        borderRight: 'solid 1px #ddd'
                    }, extensions: [javascript({ jsx: true })], placeholder: 'Please enter the code...', onChange: handleChange, onUpdate: handleStateUpdate }), _jsx(CodeInfo, { info: codeInfo })] }) }));
};
export default CodeMirrorEditor;
