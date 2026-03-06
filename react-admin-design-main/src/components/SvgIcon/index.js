import { jsx as _jsx } from "react/jsx-runtime";
import styles from './index.module.less';
export default function SvgIcon({ name, prefix = 'icon', size = 16, style }) {
    const symbolId = `#${prefix}-${name}`;
    const iconStyle = {
        width: `${size}px`,
        height: `${size}px`,
        ...style
    };
    return (_jsx("svg", { className: styles['svg-icon'], style: iconStyle, "aria-hidden": 'true', children: _jsx("use", { href: symbolId }) }));
}
