import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form } from 'antd';
const CodeInfo = ({ info }) => {
    return (_jsx("div", { style: { padding: '4px 8px', border: 'solid 1px #ddd' }, children: _jsxs(Form, { layout: 'inline', children: [_jsx(Form.Item, { label: 'Length', children: _jsx("span", { children: info.length }) }), _jsx(Form.Item, { label: 'Lines', children: _jsx("span", { children: info.lines }) }), _jsx(Form.Item, { label: 'Cursor', children: _jsx("span", { children: info.cursor }) }), _jsx(Form.Item, { label: 'Selected', children: _jsx("span", { children: info.selected }) })] }) }));
};
export default CodeInfo;
