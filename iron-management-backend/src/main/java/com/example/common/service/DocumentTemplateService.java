package com.example.common.service;

import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
import com.example.common.config.ResourceProperties;
import com.example.common.exception.BusinessException;
import com.example.common.file.GeneratedFile;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DocumentTemplateService {

    private static final DateTimeFormatter FILE_NAME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final String GENERATED_FILE_PREFIX = "order_";
    private static final String GENERATED_FILE_SUFFIX = ".docx";

    private final ResourceProperties resourceProperties;

    public String renderOrderDocument(Long orderId, Map<String, Object> renderData) {
        try {
            Files.createDirectories(Path.of(resourceProperties.getExportDir()));

            String fileName = "order_" + orderId + "_" + FILE_NAME_FORMATTER.format(LocalDateTime.now()) + ".docx";
            Path outputPath = Path.of(resourceProperties.getExportDir(), fileName);

            LoopRowTableRenderPolicy policy = new LoopRowTableRenderPolicy();
            Configure config = Configure.builder().bind("orderItems", policy).build();

            try (XWPFTemplate template = XWPFTemplate.compile(resourceProperties.getTemplatePath(), config).render(renderData);
                 OutputStream outputStream = Files.newOutputStream(outputPath)) {
                template.write(outputStream);
            }

            return fileName;
        } catch (IOException exception) {
            throw new BusinessException("Failed to generate order document");
        }
    }

    public GeneratedFile loadGeneratedFile(String fileName) {
        Path exportDir = Path.of(resourceProperties.getExportDir()).toAbsolutePath().normalize();
        Path filePath = exportDir.resolve(validateGeneratedFileName(fileName)).normalize();
        if (!filePath.startsWith(exportDir)) {
            throw new BusinessException("Requested file path is invalid");
        }
        if (!Files.exists(filePath)) {
            throw new BusinessException("Requested file does not exist");
        }

        FileSystemResource resource = new FileSystemResource(filePath);
        try {
            return new GeneratedFile(fileName, resource, Files.size(filePath));
        } catch (IOException exception) {
            throw new BusinessException("Failed to read generated file");
        }
    }

    private String validateGeneratedFileName(String fileName) {
        if (fileName == null || fileName.isBlank()
                || fileName.contains("/") || fileName.contains("\\") || fileName.contains("..")
                || !fileName.startsWith(GENERATED_FILE_PREFIX) || !fileName.endsWith(GENERATED_FILE_SUFFIX)) {
            throw new BusinessException("Requested file name is invalid");
        }
        return fileName;
    }
}
