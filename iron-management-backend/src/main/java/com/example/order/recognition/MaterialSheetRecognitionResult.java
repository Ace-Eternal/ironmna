package com.example.order.recognition;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MaterialSheetRecognitionResult {
    private List<RecognizedMaterialItem> items = new ArrayList<>();
    private double overallConfidence;
    private List<String> warnings = new ArrayList<>();
}
