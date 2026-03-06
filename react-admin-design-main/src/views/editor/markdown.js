import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { PageWrapper } from '@/components/Page';
import { MARKDOWN_EDITOR_PLUGIN } from '@/settings/websiteSetting';
import MDEditor from '@uiw/react-md-editor';
const MarkdownEditor = () => {
    const [value, setValue] = useState('**Hello world!!!**');
    const handleChange = (value) => {
        setValue(value);
    };
    return (_jsx(PageWrapper, { plugin: MARKDOWN_EDITOR_PLUGIN, children: _jsx("div", { "data-color-mode": 'light', children: _jsx(MDEditor, { value: value, height: 400, onChange: handleChange }) }) }));
};
export default MarkdownEditor;
