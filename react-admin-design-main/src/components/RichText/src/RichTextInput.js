import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useDebounceFn } from 'ahooks';
import { keepCursorEnd, getPasteText } from '@/utils/rich-text';
const RichTextInput = ({ value = '请输入文本', style = {}, hasBorder = false, onChange }) => {
    const styles = useMemo(() => {
        const borderStyle = hasBorder ? { border: '1px solid #d9d9d9', borderRadius: '6px' } : {};
        return {
            minHeight: '20px',
            padding: '6px 8px',
            outline: 'none',
            wordBreak: 'break-all',
            ...borderStyle,
            ...style
        };
    }, [style]);
    const { run: handleInput } = useDebounceFn((event) => {
        onChange(event.target.innerHTML);
    }, {
        wait: 200
    });
    const handlePaste = (event) => {
        event.preventDefault();
        const text = getPasteText(event);
        onChange(text);
        setTimeout(() => {
            keepCursorEnd(event.target);
        }, 0);
    };
    return (_jsx("div", { dangerouslySetInnerHTML: { __html: value }, className: 'rich-text-input', style: { ...styles }, contentEditable: true, spellCheck: 'false', onPaste: handlePaste, onInput: handleInput }));
};
export default RichTextInput;
