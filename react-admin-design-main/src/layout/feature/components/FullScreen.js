import { jsx as _jsx } from "react/jsx-runtime";
import { Tooltip } from 'antd';
import { useFullscreen } from 'ahooks';
import SvgIcon from '@/components/SvgIcon';
export default function FullScreen() {
    const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);
    return (_jsx(Tooltip, { title: isFullscreen ? '退出全屏' : '进入全屏', placement: 'bottom', mouseEnterDelay: 0.5, children: _jsx("span", { className: 'icon-btn', onClick: toggleFullscreen, children: !isFullscreen ? _jsx(SvgIcon, { name: 'screen-full', size: 20 }) : _jsx(SvgIcon, { name: 'screen-normal', size: 20 }) }) }));
}
