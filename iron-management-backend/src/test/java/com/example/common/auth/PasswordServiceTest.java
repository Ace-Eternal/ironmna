package com.example.common.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordServiceTest {

    @Test
    void matchesBcryptPassword() {
        AuthProperties properties = new AuthProperties();
        PasswordService service = new PasswordService(properties);

        String hash = service.encode("correct-password");

        assertThat(service.matches("correct-password", hash)).isTrue();
        assertThat(service.matches("wrong-password", hash)).isFalse();
    }

    @Test
    void rejectsPlaintextPasswordByDefault() {
        AuthProperties properties = new AuthProperties();
        PasswordService service = new PasswordService(properties);

        assertThat(service.matches("legacy-password", "legacy-password")).isFalse();
    }
}
