package com.example.controller;

import com.example.admin.application.AdminApplicationService;
import com.example.dto.AdminDTO;
import com.example.dto.Result;
import com.example.vo.AdminVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminApplicationService adminApplicationService;

    @PostMapping("/login")
    public Result login(@RequestBody AdminVO adminVO) {
        AdminDTO dto = adminApplicationService.login(adminVO);
        return Result.ok("鐧诲綍鎴愬姛", dto);
    }

    @GetMapping("/getUserInfo")
    public Result getUserInfo(@RequestHeader("Authorization") String token) {
        AdminDTO dto = adminApplicationService.getUserInfo(token);
        return Result.ok("鑾峰彇鐢ㄦ埛淇℃伅鎴愬姛", dto);
    }
}
