package com.example.controller;

import com.example.dashboard.application.DashboardApplicationService;
import com.example.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/dashboard")
@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardApplicationService dashboardApplicationService;

    @GetMapping("/home")
    public Result getHomeDashboard() {
        return Result.ok("获取首页经营看板成功", dashboardApplicationService.getHomeDashboard());
    }
}
