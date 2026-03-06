import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from 'antd';
import { Breadcrumb, FoldTrigger } from './components';
import LayoutFeature from '../feature';
const LayoutHeader = () => {
    const { Header } = Layout;
    return (_jsx(Header, { className: 'flex-between-h', style: {
            flexDirection: 'column',
            height: 'auto',
            background: '#fff'
        }, children: _jsxs("div", { className: 'flex-between-h', style: { padding: '0 12px' }, children: [_jsxs("div", { className: 'flex-center-v', children: [_jsx(FoldTrigger, {}), _jsx(Breadcrumb, {})] }), _jsx(LayoutFeature, {})] }) }));
};
export default LayoutHeader;
