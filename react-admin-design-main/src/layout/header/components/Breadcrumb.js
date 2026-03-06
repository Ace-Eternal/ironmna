import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, matchRoutes } from 'react-router-dom';
import { useAppSelector } from '@/stores';
import SvgIcon from '@/components/SvgIcon';
export default function LayoutBreadcrumb() {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const { pathname } = useLocation();
    const getMenuList = useAppSelector(state => state.menu.menuList);
    useEffect(() => {
        const matchRouteList = matchRoutes(getMenuList, pathname) || [];
        const breadcrumbList = matchRouteList.map((item) => {
            const { name, icon = '' } = item?.route;
            return {
                title: (_jsxs(_Fragment, { children: [icon && _jsx(SvgIcon, { name: icon, style: { marginRight: 8 } }), _jsx("span", { children: name })] }))
            };
        });
        setBreadcrumbs(breadcrumbList);
    }, [pathname]);
    return (_jsx("div", { className: 'flex-center-v', style: { padding: '0 16px' }, children: _jsx(Breadcrumb, { items: breadcrumbs }) }));
}
