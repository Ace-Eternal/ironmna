import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import * as wangEditor from '@wangeditor/editor';
function ToolbarComponent(props) {
    const { editor, defaultConfig = {}, mode = 'default', style = {}, className } = props;
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current == null)
            return;
        if (editor == null)
            return;
        wangEditor.createToolbar({
            editor,
            selector: ref.current,
            config: defaultConfig,
            mode
        });
    }, [editor]);
    return _jsx("div", { style: style, ref: ref, className: className });
}
export default ToolbarComponent;
