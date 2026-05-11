package com.example.common.auth;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.domain.Admin;
import com.example.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthTokenService {

    private static final int TOKEN_BYTES = 32;

    private final AdminService adminService;
    private final SecureRandom secureRandom = new SecureRandom();

    public String issueToken(Admin admin) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        admin.setToken(token);
        adminService.updateById(admin);
        return token;
    }

    public Optional<Admin> findByAuthorizationHeader(String authorization) {
        String token = normalizeToken(authorization);
        if (token == null) {
            return Optional.empty();
        }
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("token", token);
        return Optional.ofNullable(adminService.getOne(queryWrapper));
    }

    private String normalizeToken(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return null;
        }
        String token = authorization.trim();
        if (token.regionMatches(true, 0, "Bearer ", 0, 7)) {
            token = token.substring(7).trim();
        }
        return token.isBlank() ? null : token;
    }
}
