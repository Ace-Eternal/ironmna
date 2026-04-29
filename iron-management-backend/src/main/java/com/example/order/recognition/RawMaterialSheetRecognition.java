package com.example.order.recognition;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RawMaterialSheetRecognition {
    private List<RawRecognizedMaterialItem> items = new ArrayList<>();
    private Double overallConfidence;
    private List<String> warnings = new ArrayList<>();
}
