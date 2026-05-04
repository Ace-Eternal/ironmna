package com.example.dashboard.application;

import com.example.mapper.DashboardMapper;
import com.example.vo.DashboardHomeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardApplicationServiceImpl implements DashboardApplicationService {

    private final DashboardMapper dashboardMapper;

    @Override
    public DashboardHomeVO getHomeDashboard() {
        DashboardHomeVO dashboard = new DashboardHomeVO();
        dashboard.setSummary(dashboardMapper.selectSummary());
        dashboard.setMonthlyTrend(dashboardMapper.selectMonthlyTrend());
        dashboard.setCustomerRanking(dashboardMapper.selectCustomerRanking());
        dashboard.setMaterialTypeShare(dashboardMapper.selectMaterialTypeShare());
        dashboard.setSteelTypeRanking(dashboardMapper.selectSteelTypeRanking());
        dashboard.setRecentOrders(dashboardMapper.selectRecentOrders());
        return dashboard;
    }
}
