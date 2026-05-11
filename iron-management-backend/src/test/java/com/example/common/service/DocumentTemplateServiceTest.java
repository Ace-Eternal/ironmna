package com.example.common.service;

import com.example.common.config.ResourceProperties;
import com.example.common.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DocumentTemplateServiceTest {

    @TempDir
    Path exportDir;

    @Test
    void rejectsPathTraversalDownloadName() {
        ResourceProperties properties = new ResourceProperties();
        properties.setExportDir(exportDir.toString());
        DocumentTemplateService service = new DocumentTemplateService(properties);

        assertThatThrownBy(() -> service.loadGeneratedFile("../application.yaml"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Requested file name is invalid");
    }

    @Test
    void rejectsNonGeneratedDownloadName() {
        ResourceProperties properties = new ResourceProperties();
        properties.setExportDir(exportDir.toString());
        DocumentTemplateService service = new DocumentTemplateService(properties);

        assertThatThrownBy(() -> service.loadGeneratedFile("application.yaml"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Requested file name is invalid");
    }
}
