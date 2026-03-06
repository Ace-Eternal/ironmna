import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from 'antd';
import { useECharts } from '@/hooks/web/useECharts';
const ChartsCard = ({ loading, options, height }) => {
    const { chartRef } = useECharts(options, loading);
    return (_jsx(Card, { loading: loading, bordered: false, children: _jsx("div", { ref: chartRef, style: {
                width: '100%',
                height: height + 'px'
            } }) }));
};
export default ChartsCard;
