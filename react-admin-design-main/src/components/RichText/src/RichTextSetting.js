import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Button, Space, Select, ColorPicker, Dropdown } from 'antd';
import RichTextInput from './RichTextInput';
import SvgIcon from '@/components/SvgIcon';
const alignItems = [
    {
        key: 'left',
        label: '左对齐'
    },
    {
        key: 'center',
        label: '居中'
    },
    {
        key: 'right',
        label: '右对齐'
    }
];
const RichTextSetting = ({ textValue, textStyles = {}, onChangeValue, onChangeStyles }) => {
    const handleTextAlign = ({ key }) => {
        onChangeStyles?.({ ...textStyles, textAlign: key });
    };
    const handleChangeStyle = (type, val) => {
        let styleVal = '';
        switch (type) {
            case 'fontWeight':
                styleVal = val ? '' : 'bold';
                break;
            case 'fontStyle':
                styleVal = val ? '' : 'italic';
                break;
            case 'textShadow':
                styleVal = val ? '' : '1px 1px 1px #333';
                break;
        }
        onChangeStyles?.({ ...textStyles, [type]: styleVal ? styleVal : '' });
    };
    return (_jsxs(Form, { colon: false, labelCol: { span: 6 }, wrapperCol: { span: 18 }, labelAlign: 'left', style: { width: '300px', margin: '0 auto' }, children: [_jsx(Form.Item, { label: '\u6587\u672C', children: _jsx(RichTextInput, { value: textValue, hasBorder: true, onChange: val => onChangeValue(val) }) }), _jsx(Form.Item, { label: '\u5B57\u4F53', children: _jsx(Select, { value: textStyles.fontFamily, onChange: (value) => onChangeStyles?.({ ...textStyles, fontFamily: value }), children: ['黑体', '宋体', '楷体', '隶书', '微软雅黑', '华文行楷', '方正姚体'].map(item => {
                        return (_jsx(Select.Option, { value: item, style: { fontFamily: item }, children: item }, item));
                    }) }) }), _jsx(Form.Item, { label: '\u5B57\u53F7', children: _jsx(Select, { value: textStyles.fontSize, onChange: (value) => onChangeStyles?.({ ...textStyles, fontSize: value, lineHeight: value }), children: [12, 14, 16, 20, 24, 32, 48].map(item => {
                        return (_jsx(Select.Option, { value: item + 'px', style: { fontSize: item + 'px' }, children: item + 'px' }, item));
                    }) }) }), _jsx(Form.Item, { label: '\u6837\u5F0F', children: _jsxs(Space, { size: 6, children: [_jsx(ColorPicker, { onChange: (_, hex) => onChangeStyles?.({ ...textStyles, color: hex }), children: _jsx(Button, { icon: _jsx(SvgIcon, { name: 'color-font', size: 20 }), style: { color: textStyles.color } }) }), _jsx(ColorPicker, { onChange: (_, hex) => onChangeStyles?.({ ...textStyles, backgroundColor: hex }), children: _jsx(Button, { icon: _jsx(SvgIcon, { name: 'color-bg', size: 20 }), style: { color: textStyles.backgroundColor } }) }), _jsx(Button, { icon: _jsx(SvgIcon, { name: 'font-bold', size: 20 }), style: { color: textStyles.fontWeight ? '#1890ff' : '' }, onClick: () => handleChangeStyle('fontWeight', textStyles.fontWeight) }), _jsx(Button, { icon: _jsx(SvgIcon, { name: 'font-italic', size: 20 }), style: { color: textStyles.fontStyle ? '#1890ff' : '' }, onClick: () => handleChangeStyle('fontStyle', textStyles.fontStyle) }), _jsx(Button, { icon: _jsx(SvgIcon, { name: 'font-shadow', size: 20 }), style: { color: textStyles.textShadow ? '#1890ff' : '' }, onClick: () => handleChangeStyle('textShadow', textStyles.textShadow) }), _jsx(Dropdown, { menu: { items: alignItems, selectedKeys: [textStyles.textAlign], onClick: handleTextAlign }, placement: 'bottomRight', trigger: ['click'], children: _jsx(Button, { icon: _jsx(SvgIcon, { name: 'font-align', size: 20 }) }) })] }) })] }));
};
export default RichTextSetting;
