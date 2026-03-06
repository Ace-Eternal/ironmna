import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/Page';
import { WANG_EDITOR_PLUGIN } from '@/settings/websiteSetting';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import '@wangeditor/editor/dist/css/style.css';
const RichTextEditor = () => {
    const [editor, setEditor] = useState(null);
    const [html, setHtml] = useState('<p>hello</p>');
    const toolbarConfig = {};
    const editorConfig = {};
    useEffect(() => {
        return () => {
            if (editor == null)
                return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);
    return (_jsx(PageWrapper, { plugin: WANG_EDITOR_PLUGIN, children: _jsxs("div", { style: { border: '1px solid #ccc' }, children: [_jsx(Toolbar, { editor: editor, defaultConfig: toolbarConfig, mode: 'default', style: { borderBottom: '1px solid #ccc' } }), _jsx(Editor, { defaultConfig: editorConfig, value: html, onCreated: setEditor, onChange: editor => setHtml(editor.getHtml()), mode: 'default', style: { height: '500px', overflowY: 'hidden' } })] }) }));
};
export default RichTextEditor;
