package com.example.order.recognition;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.material-recognition")
public class MaterialRecognitionProperties {
    private String provider = "openai";
    private String baseUrl = "https://api.openai.com/v1";
    private String apiKey;
    private String model = "gpt-4.1";
    private long maxImageBytes = 8 * 1024 * 1024;
}
