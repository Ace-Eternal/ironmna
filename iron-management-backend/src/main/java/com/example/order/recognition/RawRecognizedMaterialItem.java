package com.example.order.recognition;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RawRecognizedMaterialItem {
    private Integer rowIndex;
    private String type;
    private String steel_type;
    private Double length;
    private Double length_remain;
    private Double width;
    private Double width_remain;
    private Double thickness;
    private Double thickness_remain;
    private Integer amount;
    private Double monovalent;
    private Double cut_fee;
    private String note;
    private Map<String, Double> fieldConfidences = new HashMap<>();
    private List<String> needsReviewFields;
    private String sourceNote;
}
