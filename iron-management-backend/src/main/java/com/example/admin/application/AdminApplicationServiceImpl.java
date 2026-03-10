package com.example.admin.application;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.common.exception.BusinessException;
import com.example.domain.Admin;
import com.example.dto.AdminDTO;
import com.example.service.AdminService;
import com.example.vo.AdminVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminApplicationServiceImpl implements AdminApplicationService {

    private final AdminService adminService;

    @Override
    public AdminDTO login(AdminVO adminVO) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", adminVO.getUsername());
        queryWrapper.eq("password", adminVO.getPassword());
        Admin admin = adminService.getOne(queryWrapper);
        if (admin == null) {
            throw new BusinessException("Invalid username or password");
        }
        return toDto(admin);
    }

    @Override
    public AdminDTO getUserInfo(String token) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("token", token);
        Admin admin = adminService.getOne(queryWrapper);
        if (admin == null) {
            throw new BusinessException("User token is invalid");
        }
        return toDto(admin);
    }

    private AdminDTO toDto(Admin admin) {
        return new AdminDTO(
                admin.getId().toString(),
                admin.getUsername(),
                admin.getRealname(),
                admin.getAvatar(),
                admin.getToken(),
                admin.getDescp(),
                admin.getHomepath(),
                admin.getPassword()
        );
    }
}
