import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { createEditor } from '@wangeditor/editor';
function EditorComponent(props) {
    const { defaultContent = [], onCreated, defaultHtml = '', value = '', onChange, defaultConfig = {}, mode = 'default', style = {}, className } = props;
    const ref = useRef(null);
    const [editor, setEditor] = useState(null);
    const [curValue, setCurValue] = useState('');
    const handleCreated = (editor) => {
        // Component attr onCreated。(组件属性 onCreated)
        if (onCreated)
            onCreated(editor);
        // Editor config onCreate。(编辑器 配置 onCreated)
        const { onCreated: onCreatedFromConfig } = defaultConfig;
        if (onCreatedFromConfig)
            onCreatedFromConfig(editor);
    };
    const handleChanged = (editor) => {
        // Records the current html value。(记录当前 html 值)
        setCurValue(editor.getHtml());
        // Component attr onChange。(组件属性 onChange)
        if (onChange)
            onChange(editor);
        // Editor config onChange。(编辑器 配置 onChange)
        const { onChange: onChangeFromConfig } = defaultConfig;
        if (onChangeFromConfig)
            onChangeFromConfig(editor);
    };
    const handleDestroyed = (editor) => {
        const { onDestroyed } = defaultConfig;
        setEditor(null);
        if (onDestroyed) {
            onDestroyed(editor);
        }
    };
    // Value changes, resets HTML。(value 变化，重置 HTML)
    useEffect(() => {
        if (editor == null)
            return;
        // Ignore if it is equal to the current html value。(如果和当前 html 值相等，则忽略)
        if (value === curValue)
            return;
        // Reset HTML。(重新设置 HTML)
        try {
            editor.setHtml(value);
        }
        catch (error) {
            console.error(error);
        }
    }, [value]);
    useEffect(() => {
        if (ref.current == null)
            return;
        if (editor != null)
            return;
        // Prevents duplicate rendering when the editor is already created。(防止重复渲染 当编辑器已经创建就不在创建了)
        if (ref.current?.getAttribute('data-w-e-textarea'))
            return;
        const newEditor = createEditor({
            selector: ref.current,
            config: {
                ...defaultConfig,
                onCreated: handleCreated,
                onChange: handleChanged,
                onDestroyed: handleDestroyed
            },
            content: defaultContent,
            html: defaultHtml || value,
            mode
        });
        setEditor(newEditor);
    }, [editor]);
    return _jsx("div", { style: style, ref: ref, className: className });
}
export default EditorComponent;
