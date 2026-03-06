import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import LayoutMenu from './menu';
import LayoutHeader from './header';
import LayoutTags from './tags';
import { AppLogo } from '@/components/AppLogo';
import './index.less';
import { useTitle } from '@/hooks/web/useTitle';
import { useAppSelector } from '@/stores';
export const BasicLayout = () => {
    useTitle();
    const { Sider, Content } = Layout;
    const { state } = useLocation();
    const { key = 'key' } = state || {};
    const getMenuFold = useAppSelector(st => st.app.appConfig?.menuSetting?.menuFold);
    return (_jsxs(Layout, { className: 'layout_wrapper', children: [_jsxs(Sider, { width: 210, trigger: null, collapsed: getMenuFold, style: { height: '100vh' }, children: [_jsx(AppLogo, {}), _jsx(LayoutMenu, {})] }), _jsxs(Layout, { children: [_jsx(LayoutHeader, {}), _jsxs(Layout, { id: 'mainCont', children: [_jsx(LayoutTags, {}), _jsx(Content, { children: _jsx(Outlet, {}, key) })] })] })] }));
};
