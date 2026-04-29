package com.example.order.recognition;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class RecognizedMaterialItem {
    private int rowIndex;
    private String type;
    private String steel_type;
    private double length;
    private double length_remain;
    private double width;
    private double width_remain;
    private double thickness;
    private double thickness_remain;
    private int amount;
    private double monovalent;
    private double cut_fee;
    private String note;
    private Map<String, Double> fieldConfidences = new HashMap<>();
    private List<String> needsReviewFields = new ArrayList<>();
    private String sourceNote;
}
