package com.example.common.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final AuthProperties authProperties;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean matches(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null || storedPassword.isBlank()) {
            return false;
        }
        if (isBcryptHash(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return authProperties.isAllowLegacyPlaintextPasswords() && storedPassword.equals(rawPassword);
    }

    public boolean shouldUpgrade(String storedPassword) {
        return storedPassword != null && !isBcryptHash(storedPassword);
    }

    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private boolean isBcryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}
