package com.example.admin.application;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.common.auth.AuthTokenService;
import com.example.common.auth.PasswordService;
import com.example.common.auth.UnauthorizedException;
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
    private final AuthTokenService authTokenService;
    private final PasswordService passwordService;

    @Override
    public AdminDTO login(AdminVO adminVO) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", adminVO.getUsername());
        Admin admin = adminService.getOne(queryWrapper);
        if (admin == null || !passwordService.matches(adminVO.getPassword(), admin.getPassword())) {
            throw new BusinessException("Invalid username or password");
        }
        if (passwordService.shouldUpgrade(admin.getPassword())) {
            admin.setPassword(passwordService.encode(adminVO.getPassword()));
        }
        String token = authTokenService.issueToken(admin);
        admin.setToken(token);
        return toDto(admin);
    }

    @Override
    public AdminDTO getUserInfo(String token) {
        return authTokenService.findByAuthorizationHeader(token)
                .map(this::toDto)
                .orElseThrow(() -> new UnauthorizedException("User token is invalid"));
    }

    private AdminDTO toDto(Admin admin) {
        return new AdminDTO(
                admin.getId().toString(),
                admin.getUsername(),
                admin.getRealname(),
                admin.getAvatar(),
                admin.getToken(),
                admin.getDescp(),
                admin.getHomepath()
        );
    }
}
