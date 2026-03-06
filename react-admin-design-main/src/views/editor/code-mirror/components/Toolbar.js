import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Select, Checkbox } from 'antd';
const CodeToolbar = ({ config, valueChange }) => {
    const [form] = Form.useForm();
    const onValuesChange = (values) => {
        valueChange(values);
    };
    return (_jsx("div", { className: 'flex-between-h', style: {
            padding: '8px',
            border: 'solid 1px #ddd'
        }, children: _jsxs(Form, { form: form, initialValues: { ...config }, layout: 'inline', labelAlign: 'left', onValuesChange: onValuesChange, children: [_jsx(Form.Item, { label: 'language', name: 'language', children: _jsx(Select, { size: 'small', options: [
                            { label: 'html', value: 'html' },
                            { label: 'javascript', value: 'javascript' },
                            { label: 'typescript', value: 'typescript' }
                        ], style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'autoFocus', name: 'autoFocus', valuePropName: 'checked', children: _jsx(Checkbox, {}) }), _jsx(Form.Item, { label: 'indentWithTab', name: 'indentWithTab', valuePropName: 'checked', children: _jsx(Checkbox, {}) }), _jsx(Form.Item, { label: 'height', name: 'height', children: _jsx(Select, { size: 'small', options: [
                            { label: 'auto', value: 'auto' },
                            { label: '350px', value: '350px' },
                            { label: '500px', value: '500px' }
                        ], style: { width: '100px' } }) })] }) }));
};
export default CodeToolbar;
