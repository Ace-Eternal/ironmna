import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Divider } from 'antd';
import { FullScreen, DocLink, GithubLink, UserDropdown } from './components';
import moduleStyle from './index.module.less';
export default function LayoutFeature() {
    const prefixCls = 'layout_feature';
    return (_jsxs("div", { className: moduleStyle[prefixCls], children: [_jsxs("div", { className: moduleStyle[`${prefixCls}-main`], children: [_jsx(FullScreen, {}), _jsx(DocLink, {}), _jsx(GithubLink, {})] }), _jsx(Divider, { type: 'vertical', className: moduleStyle[`${prefixCls}-divider`] }), _jsx(UserDropdown, {})] }));
}
