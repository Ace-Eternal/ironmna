import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from 'antd';
import CountUp from 'react-countup';
import SvgIcon from '@/components/SvgIcon';
const CountUpCard = props => {
    return (_jsx(Card, { loading: props.loading, bordered: false, bodyStyle: { padding: 0 }, children: _jsxs("div", { className: 'flex-center-v', children: [_jsx("div", { className: 'flex-center', style: {
                        width: '120px',
                        height: '120px',
                        borderRadius: '8px 0 0 8px',
                        background: props.color
                    }, children: _jsx(SvgIcon, { name: props.iconName, size: 40, style: { color: '#fff' } }) }), _jsxs("div", { style: { flex: 1, textAlign: 'center' }, children: [_jsx(CountUp, { start: 0, end: props.countNum, duration: 3, style: {
                                fontSize: '32px',
                                color: '#515a6e'
                            } }), _jsx("p", { style: { fontSize: '16px' }, children: props.title })] })] }) }));
};
export default CountUpCard;
