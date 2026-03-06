package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.domain.Admin;
import com.example.dto.AdminDTO;
import com.example.dto.Result;
import com.example.service.AdminService;
import com.example.vo.AdminVO;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
@CrossOrigin("*")
public class AdminController {

    @Resource
    AdminService adminService;

    @PostMapping("/login")
    public Result login(@RequestBody AdminVO adminVO){
        QueryWrapper<Admin>queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", adminVO.getUsername());
        queryWrapper.eq("password", adminVO.getPassword());
        Admin res = adminService.getOne(queryWrapper);
        AdminDTO dto = new AdminDTO(res.getId().toString(),res.getUsername(),res.getRealname()
        ,res.getAvatar(),res.getToken(),res.getDescp(),res.getHomepath(),res.getPassword());
        return Result.ok("登录成功", dto);
    }

    @GetMapping("/getUserInfo")
    public Result getUserInfo(@RequestHeader("Authorization") String token){
        QueryWrapper<Admin>queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("token", token);
        Admin res = adminService.getOne(queryWrapper);
        AdminDTO dto = new AdminDTO(res.getId().toString(),res.getUsername(),res.getRealname()
                ,res.getAvatar(),res.getToken(),res.getDescp(),res.getHomepath(),res.getPassword());
        return Result.ok("获取用户信息成功", dto);
    }

}
