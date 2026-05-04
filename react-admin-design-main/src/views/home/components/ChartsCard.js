import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Card } from 'antd';
import { useECharts } from '@/hooks/web/useECharts';
const ChartsCard = ({ loading, options, height, onChartClick }) => {
    const { chartRef, getInstance } = useECharts(options, loading);
    useEffect(() => {
        if (loading || !onChartClick)
            return;
        const chart = getInstance();
        if (!chart)
            return;
        chart.off('click');
        chart.on('click', onChartClick);
        return () => {
            chart.off('click', onChartClick);
        };
    }, [loading, onChartClick, getInstance]);
    return (_jsx(Card, { loading: loading, bordered: false, children: _jsx("div", { ref: chartRef, style: {
                width: '100%',
                height: height + 'px'
            } }) }));
};
export default ChartsCard;
