package com.example.common.file;

import org.springframework.core.io.Resource;

public record GeneratedFile(String fileName, Resource resource, long contentLength) {
}
