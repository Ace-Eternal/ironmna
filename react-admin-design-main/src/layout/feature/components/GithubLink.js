import { jsx as _jsx } from "react/jsx-runtime";
import { Tooltip } from 'antd';
import { openWindow } from '@/utils';
import SvgIcon from '@/components/SvgIcon';
export default function GithubLink() {
    function openGithub() {
        openWindow('https://github.com/baimingxuan/react-admin-design');
    }
    return (_jsx(Tooltip, { title: 'github', placement: 'bottom', mouseEnterDelay: 0.5, children: _jsx("span", { className: 'icon-btn', onClick: openGithub, children: _jsx(SvgIcon, { name: 'github', size: 20 }) }) }));
}
