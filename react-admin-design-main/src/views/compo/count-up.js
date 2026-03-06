import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Input, InputNumber, Space } from 'antd';
import { PageWrapper } from '@/components/Page';
import CountUp, { useCountUp } from 'react-countup';
import { COUNTUP_PLUGIN } from '@/settings/websiteSetting';
const CountUpPage = () => {
    const [form] = Form.useForm();
    const [formData, setFromData] = useState({
        start: 0,
        end: 2020,
        duration: 4,
        decimals: 0,
        separator: ',',
        prefix: '￥ ',
        suffix: ' rmb'
    });
    const countUpRef = useRef(null);
    const { start, reset } = useCountUp({
        ref: countUpRef,
        ...formData
    });
    useEffect(() => {
        reset();
    }, []);
    const onValuesChange = (values) => {
        setFromData({ ...formData, ...values });
    };
    return (_jsx(PageWrapper, { plugin: COUNTUP_PLUGIN, children: _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 6, children: _jsx(Card, { title: '\u6B63\u5411\u589E\u52A0', bordered: false, bodyStyle: { height: '300px' }, children: _jsx(CountUp, { start: 0, end: 2020, duration: 4, style: {
                                height: '100%',
                                fontSize: '40px',
                                color: '#e65d6e'
                            }, className: 'flex-center' }) }) }), _jsx(Col, { span: 12, children: _jsxs(Card, { title: '\u81EA\u5B9A\u4E49\u914D\u7F6E', bordered: false, bodyStyle: { height: '300px' }, children: [_jsx("div", { className: 'flex-center', style: { marginBottom: '30px' }, children: _jsx("span", { ref: countUpRef, style: {
                                        fontSize: '40px',
                                        color: '#e65d6e'
                                    } }) }), _jsxs(Form, { form: form, initialValues: { ...formData }, layout: 'inline', labelAlign: 'left', labelCol: { style: { width: '80px', marginBottom: '12px' } }, onValuesChange: onValuesChange, children: [_jsx(Form.Item, { label: 'startVal:', name: 'start', children: _jsx(InputNumber, { min: 0, max: 10000, style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'endVal:', name: 'end', children: _jsx(InputNumber, { min: 0, max: 10000, style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'duration:', name: 'duration', children: _jsx(InputNumber, { min: 1, max: 100, style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'decimals:', name: 'decimals', children: _jsx(InputNumber, { min: 0, max: 100, style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'separator:', name: 'separator', children: _jsx(Input, { style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'prefix:', name: 'prefix', children: _jsx(Input, { style: { width: '100px' } }) }), _jsx(Form.Item, { label: 'suffix:', name: 'suffix', children: _jsx(Input, { style: { width: '100px' } }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: 'primary', onClick: start, children: "\u5F00\u59CB" }), _jsx(Button, { type: 'primary', danger: true, onClick: reset, children: "\u91CD\u7F6E" })] }) })] })] }) }), _jsx(Col, { span: 6, children: _jsx(Card, { title: '\u53CD\u5411\u51CF\u5C11', bordered: false, bodyStyle: { height: '300px' }, children: _jsx(CountUp, { start: 2020, end: 0, duration: 4, style: {
                                height: '100%',
                                fontSize: '40px',
                                color: '#30b08f'
                            }, className: 'flex-center' }) }) })] }) }));
};
export default CountUpPage;
