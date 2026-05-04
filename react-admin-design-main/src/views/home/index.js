import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Space, Card, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CountUpCard from './components/CountUpCard';
import ChartsCard from './components/ChartsCard';
import { getDashboardHome } from '@/api';
import { buildCountUpData, buildCustomerRankingOptions, buildMaterialTypeOptions, buildMonthlyTrendOptions, buildSteelTypeRankingOptions, emptyDashboardData } from './data';
const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(emptyDashboardData);
    const navigate = useNavigate();
    useEffect(() => {
        fetchDashboardData();
    }, []);
    async function fetchDashboardData() {
        setIsLoading(true);
        try {
            const data = await getDashboardHome();
            setDashboardData(data);
        }
        catch (error) {
            message.error('首页经营数据加载失败');
        }
        finally {
            setIsLoading(false);
        }
    }
    const countUpData = useMemo(() => buildCountUpData(dashboardData), [dashboardData]);
    const monthlyTrendOptions = useMemo(() => buildMonthlyTrendOptions(dashboardData.monthlyTrend), [dashboardData]);
    const customerRankingOptions = useMemo(() => buildCustomerRankingOptions(dashboardData.customerRanking), [dashboardData]);
    const materialTypeOptions = useMemo(() => buildMaterialTypeOptions(dashboardData.materialTypeShare), [dashboardData]);
    const steelTypeRankingOptions = useMemo(() => buildSteelTypeRankingOptions(dashboardData.steelTypeRanking), [dashboardData]);
    const recentOrderColumns = [
        {
            title: '订单号',
            dataIndex: 'orderId',
            align: 'center'
        },
        {
            title: '客户',
            dataIndex: 'customerName',
            align: 'center'
        },
        {
            title: '下单日期',
            dataIndex: 'orderDate',
            align: 'center'
        },
        {
            title: '订单金额(元)',
            dataIndex: 'totalMoney',
            align: 'center',
            render: (value) => formatNumber(value)
        },
        {
            title: '加工费(元)',
            dataIndex: 'processFee',
            align: 'center',
            render: (value) => formatNumber(value)
        },
        {
            title: '材料条数',
            dataIndex: 'itemCount',
            align: 'center'
        },
        {
            title: '总重量(kg)',
            dataIndex: 'totalWeight',
            align: 'center',
            render: (value) => formatNumber(value)
        }
    ];
    const goOrderList = useCallback((query) => {
        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.set(key, String(value));
            }
        });
        navigate(`/order/order-basic?${searchParams.toString()}`);
    }, [navigate]);
    const handleMonthlyTrendClick = useCallback((params) => {
        goOrderList({ month: params.name });
    }, [goOrderList]);
    const handleCustomerRankingClick = useCallback((params) => {
        goOrderList({ customerId: params.data?.customerId });
    }, [goOrderList]);
    const handleMaterialTypeClick = useCallback((params) => {
        goOrderList({ materialType: params.data?.materialType || params.name });
    }, [goOrderList]);
    const handleSteelTypeClick = useCallback((params) => {
        goOrderList({ steelType: params.data?.steelType || params.name });
    }, [goOrderList]);
    return (_jsxs(Space, { direction: 'vertical', size: 12, style: { display: 'flex' }, children: [_jsx(Row, { gutter: 12, children: countUpData.map(item => {
                    return (_jsx(Col, { flex: 1, children: _jsx(CountUpCard, { loading: isLoading, title: item.title, color: item.color, iconName: item.icon, countNum: item.count, decimals: item.decimals }) }, item.title));
                }) }), _jsxs(Row, { gutter: 12, children: [_jsx(Col, { xs: 24, lg: 16, children: _jsx(ChartsCard, { loading: isLoading, options: monthlyTrendOptions, height: 320, onChartClick: handleMonthlyTrendClick }) }), _jsx(Col, { xs: 24, lg: 8, children: _jsx(ChartsCard, { loading: isLoading, options: materialTypeOptions, height: 320, onChartClick: handleMaterialTypeClick }) })] }), _jsxs(Row, { gutter: 12, children: [_jsx(Col, { xs: 24, lg: 12, children: _jsx(ChartsCard, { loading: isLoading, options: customerRankingOptions, height: 350, onChartClick: handleCustomerRankingClick }) }), _jsx(Col, { xs: 24, lg: 12, children: _jsx(ChartsCard, { loading: isLoading, options: steelTypeRankingOptions, height: 350, onChartClick: handleSteelTypeClick }) })] }), _jsx(Card, { bordered: false, title: '\u6700\u8FD1\u8BA2\u5355', loading: isLoading, children: _jsx(Table, { rowKey: 'orderId', columns: recentOrderColumns, dataSource: dashboardData.recentOrders, pagination: false, size: 'middle' }) })] }));
};
function formatNumber(value) {
    return Number(value || 0).toFixed(2);
}
export default HomePage;
