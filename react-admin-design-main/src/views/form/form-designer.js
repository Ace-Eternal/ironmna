import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from 'antd';
import { PageWrapper } from '@/components/Page';
import { FORM_CREATE_DESIGNER } from '@/settings/websiteSetting';
const FormCreate = () => {
    return (_jsx(PageWrapper, { plugin: FORM_CREATE_DESIGNER, children: _jsx(Card, { bordered: false }) }));
};
export default FormCreate;
