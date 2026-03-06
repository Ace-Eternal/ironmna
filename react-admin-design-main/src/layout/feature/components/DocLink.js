import { jsx as _jsx } from "react/jsx-runtime";
import { Tooltip } from 'antd';
import SvgIcon from '@/components/SvgIcon';
export default function DocLink() {
    return (_jsx(Tooltip, { title: '\u6587\u6863', placement: 'bottom', mouseEnterDelay: 0.5, children: _jsx("span", { className: 'icon-btn', children: _jsx(SvgIcon, { name: 'document', size: 20 }) }) }));
}
