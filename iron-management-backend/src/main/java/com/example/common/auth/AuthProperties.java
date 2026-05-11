package com.example.common.auth;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {
    /**
     * 仅用于一次性迁移旧数据；生产环境默认拒绝明文密码。
     */
    private boolean allowLegacyPlaintextPasswords = false;
}
