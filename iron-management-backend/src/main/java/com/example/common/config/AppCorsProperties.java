package com.example.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@Data
@ConfigurationProperties(prefix = "app.cors")
public class AppCorsProperties {
    private List<String> allowedOrigins = new ArrayList<>(List.of(
            "http://localhost:8201",
            "http://127.0.0.1:8201"
    ));
}
