package com.example.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.io.File;

@Data
@ConfigurationProperties(prefix = "app.resources")
public class ResourceProperties {
    private String templatePath = "../word-template/template.docx";
    private String exportDir = System.getProperty("java.io.tmpdir") + File.separator + "ironman-exports";
}
