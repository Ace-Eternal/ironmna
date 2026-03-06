import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from 'antd';
import { openWindow } from '@/utils';
import SvgIcon from '@/components/SvgIcon';
import compoStyle from './compo.module.less';
const PageWrapper = (props) => {
    function openGithub() {
        openWindow(props.plugin?.url);
    }
    return (_jsxs("div", { className: compoStyle['compo_page-wrapper'], children: [_jsxs("div", { className: compoStyle['page-header'], children: [_jsxs("div", { className: compoStyle['page-header-name'], children: [_jsx(SvgIcon, { name: 'hints', size: 18 }), _jsx("span", { children: props.plugin?.name })] }), _jsx("p", { children: props.plugin?.desc }), _jsxs("p", { children: [_jsx("span", { children: "github\u6E90\u7801:" }), _jsx(Button, { type: 'link', size: 'small', onClick: openGithub, children: "\u7ACB\u5373\u8BBF\u95EE" })] })] }), _jsx("div", { className: compoStyle['page-content'], children: props.children })] }));
};
export default PageWrapper;
