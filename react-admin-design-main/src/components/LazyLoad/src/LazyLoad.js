import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
import { Spin } from 'antd';
/**
 * @description 路由懒加载
 * @param {Element} Component 需要访问的组件
 * @returns element
 */
const LazyLoad = (Component) => {
    return (_jsx(Suspense, { fallback: _jsx(Spin, { size: 'large', style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            } }), children: _jsx(Component, {}) }));
};
export default LazyLoad;
