import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Spin } from 'antd';
import { getAsyncMenus } from '@/router/menus';
import { setMenuList } from '@/stores/modules/menu';
import { getOpenKeys } from '@/utils/helper/menuHelper';
import SvgIcon from '@/components/SvgIcon';
const getItem = (label, key, icon, children, type) => {
    return {
        label,
        key,
        icon,
        children,
        type
    };
};
const LayoutMenu = (props) => {
    const { pathname } = useLocation();
    const { setMenuList: setMenuListAction } = props;
    const [loading, setLoading] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([pathname]);
    useEffect(() => {
        setSelectedKeys([pathname]);
        setOpenKeys(getOpenKeys(pathname));
    }, [pathname]);
    const addIcon = (icon) => {
        if (!icon)
            return null;
        return (_jsx("span", { className: 'anticon', children: _jsx(SvgIcon, { name: icon, size: 16 }) }));
    };
    const getMenuItem = (data, list = []) => {
        data.forEach((item) => {
            if (!item?.children?.length) {
                return list.push(getItem(item.name, item.path, addIcon(item.icon)));
            }
            list.push(getItem(item.name, item.path, addIcon(item.icon), getMenuItem(item.children)));
        });
        return list;
    };
    const getMenuList = async () => {
        setLoading(true);
        try {
            const menus = await getAsyncMenus();
            setMenuList(getMenuItem(menus));
            setMenuListAction(menus);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getMenuList();
    }, []);
    const handleOpenChange = (keys) => {
        if (keys.length === 0 || keys.length === 1)
            return setOpenKeys(keys);
        const latestKey = keys[keys.length - 1];
        if (latestKey.includes(keys[0]))
            return setOpenKeys(keys);
        setOpenKeys([latestKey]);
    };
    const navigate = useNavigate();
    const handleMenuClick = ({ key }) => {
        navigate(key);
    };
    return (_jsx("div", { className: 'layout_menu', children: _jsx(Spin, { spinning: loading, tip: 'Loading...', children: _jsx(Menu, { theme: 'dark', mode: 'inline', triggerSubMenuAction: 'click', inlineIndent: 20, subMenuOpenDelay: 0.2, openKeys: openKeys, selectedKeys: selectedKeys, items: menuList, onClick: handleMenuClick, onOpenChange: handleOpenChange }) }) }));
};
const mapStateToProps = (state) => state.menu;
const mapDispatchToProps = { setMenuList };
export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu);
