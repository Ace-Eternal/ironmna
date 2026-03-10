package com.example;

import com.example.common.config.AppCorsProperties;
import com.example.common.config.ResourceProperties;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@MapperScan("com.example.mapper")
@EnableConfigurationProperties({ResourceProperties.class, AppCorsProperties.class})
public class IronManagementBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IronManagementBackendApplication.class, args);
    }
}
