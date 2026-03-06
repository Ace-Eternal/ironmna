import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Row, Col, Space } from 'antd';
import CountUpCard from './components/CountUpCard';
import ChartsCard from './components/ChartsCard';
import { countUpData, pieOptions, ringOptions, radarOptions, barOptions, lineOptions } from './data';
const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return (_jsxs(Space, { direction: 'vertical', size: 12, style: { display: 'flex' }, children: [_jsx(Row, { gutter: 12, children: countUpData.map(item => {
                    return (_jsx(Col, { flex: 1, children: _jsx(CountUpCard, { loading: isLoading, title: item.title, color: item.color, iconName: item.icon, countNum: item.count }) }, item.title));
                }) }), _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 8, children: _jsx(ChartsCard, { loading: isLoading, options: pieOptions, height: 300 }) }), _jsx(Col, { span: 8, children: _jsx(ChartsCard, { loading: isLoading, options: ringOptions, height: 300 }) }), _jsx(Col, { span: 8, children: _jsx(ChartsCard, { loading: isLoading, options: radarOptions, height: 300 }) })] }), _jsxs(Row, { gutter: 12, children: [_jsx(Col, { span: 12, children: _jsx(ChartsCard, { loading: isLoading, options: barOptions, height: 350 }) }), _jsx(Col, { span: 12, children: _jsx(ChartsCard, { loading: isLoading, options: lineOptions, height: 350 }) })] })] }));
};
export default HomePage;
