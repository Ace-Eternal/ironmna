package com.example.order.recognition;

import com.example.common.exception.BusinessException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MaterialSheetRecognitionService {

    private static final String SQUARE_STEEL = "方钢";
    private static final String ROUND_STEEL = "圆钢";
    private static final Set<String> ALLOWED_TYPES = Set.of(SQUARE_STEEL, ROUND_STEEL);
    private static final Set<String> ALLOWED_STEEL_TYPES = Set.of(
            "45#", "50#", "P20", "P20H", "718", "718H", "H13", "H13R", "40Cr", "4Cr13",
            "Cr12", "Cr12正材", "2083", "S136", "S136H", "NAK80", "Cr12MoV", "SKD61", "SKD11", "DC53"
    );
    private static final Set<String> SUPPORTED_CONTENT_TYPES = Set.of("image/jpeg", "image/jpg", "image/png", "image/webp");
    private static final List<String> REQUIRED_REVIEW_FIELDS = List.of("type", "steel_type", "length", "thickness", "amount", "monovalent");

    private final MaterialRecognitionProvider provider;
    private final MaterialRecognitionProperties properties;
    private final ObjectMapper objectMapper;

    public MaterialSheetRecognitionResult recognize(MultipartFile file) {
        MaterialSheetImage image = validateAndRead(file);
        String rawJson = provider.recognize(image);
        RawMaterialSheetRecognition rawRecognition = parseRawRecognition(rawJson);
        return normalize(rawRecognition);
    }

    MaterialSheetRecognitionResult normalize(RawMaterialSheetRecognition rawRecognition) {
        MaterialSheetRecognitionResult result = new MaterialSheetRecognitionResult();
        result.setOverallConfidence(defaultNumber(rawRecognition.getOverallConfidence()));
        result.setWarnings(rawRecognition.getWarnings() == null ? new ArrayList<>() : new ArrayList<>(rawRecognition.getWarnings()));

        List<RawRecognizedMaterialItem> rawItems = rawRecognition.getItems() == null ? List.of() : rawRecognition.getItems();
        for (int i = 0; i < rawItems.size(); i++) {
            result.getItems().add(normalizeItem(rawItems.get(i), i + 1, result.getWarnings()));
        }

        if (result.getItems().isEmpty()) {
            result.getWarnings().add("未识别到材料明细行");
        }

        return result;
    }

    private MaterialSheetImage validateAndRead(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("请上传材料单图片");
        }
        String contentType = file.getContentType();
        if (contentType == null || !SUPPORTED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException("仅支持 JPG、PNG、WEBP 图片");
        }
        if (file.getSize() > properties.getMaxImageBytes()) {
            throw new BusinessException("材料单图片不能超过 " + (properties.getMaxImageBytes() / 1024 / 1024) + "MB");
        }

        try {
            return new MaterialSheetImage(file.getBytes(), contentType, file.getOriginalFilename());
        } catch (Exception exception) {
            throw new BusinessException("读取材料单图片失败");
        }
    }

    private RawMaterialSheetRecognition parseRawRecognition(String rawJson) {
        try {
            return objectMapper.readValue(rawJson, RawMaterialSheetRecognition.class);
        } catch (Exception exception) {
            throw new BusinessException("材料单识别结果格式错误");
        }
    }

    private RecognizedMaterialItem normalizeItem(RawRecognizedMaterialItem rawItem, int fallbackRowIndex, List<String> warnings) {
        RecognizedMaterialItem item = new RecognizedMaterialItem();
        item.setRowIndex(rawItem.getRowIndex() == null || rawItem.getRowIndex() <= 0 ? fallbackRowIndex : rawItem.getRowIndex());
        item.setFieldConfidences(rawItem.getFieldConfidences() == null ? java.util.Map.of() : rawItem.getFieldConfidences());
        item.setSourceNote(rawItem.getSourceNote());
        item.setNote(rawItem.getNote());

        HashSet<String> reviewFields = new HashSet<>(rawItem.getNeedsReviewFields() == null ? List.of() : rawItem.getNeedsReviewFields());
        normalizeType(rawItem, item, reviewFields, warnings);
        normalizeSteelType(rawItem, item, reviewFields, warnings);

        item.setLength(defaultNumber(rawItem.getLength()));
        item.setLength_remain(defaultNumber(rawItem.getLength_remain()));
        item.setThickness(defaultNumber(rawItem.getThickness()));
        item.setThickness_remain(defaultNumber(rawItem.getThickness_remain()));
        item.setAmount(rawItem.getAmount() == null ? 0 : rawItem.getAmount());
        item.setMonovalent(defaultNumber(rawItem.getMonovalent()));
        item.setCut_fee(defaultNumber(rawItem.getCut_fee()));

        if (ROUND_STEEL.equals(item.getType())) {
            item.setWidth(0);
            item.setWidth_remain(0);
        } else {
            item.setWidth(defaultNumber(rawItem.getWidth()));
            item.setWidth_remain(defaultNumber(rawItem.getWidth_remain()));
        }

        for (String field : REQUIRED_REVIEW_FIELDS) {
            if (isRequiredFieldMissing(item, field)) {
                reviewFields.add(field);
            }
        }

        item.setNeedsReviewFields(new ArrayList<>(reviewFields));
        return item;
    }

    private void normalizeType(RawRecognizedMaterialItem rawItem, RecognizedMaterialItem item, Set<String> reviewFields, List<String> warnings) {
        if (rawItem.getType() == null || rawItem.getType().isBlank()) {
            reviewFields.add("type");
            return;
        }
        String type = rawItem.getType().trim();
        if (ALLOWED_TYPES.contains(type)) {
            item.setType(type);
            return;
        }
        reviewFields.add("type");
        warnings.add("第 " + item.getRowIndex() + " 行材料类型不在允许列表：" + type);
    }

    private void normalizeSteelType(RawRecognizedMaterialItem rawItem, RecognizedMaterialItem item, Set<String> reviewFields, List<String> warnings) {
        if (rawItem.getSteel_type() == null || rawItem.getSteel_type().isBlank()) {
            reviewFields.add("steel_type");
            return;
        }
        String steelType = rawItem.getSteel_type().trim();
        if (ALLOWED_STEEL_TYPES.contains(steelType)) {
            item.setSteel_type(steelType);
            return;
        }
        reviewFields.add("steel_type");
        warnings.add("第 " + item.getRowIndex() + " 行钢号不在允许列表：" + steelType);
    }

    private boolean isRequiredFieldMissing(RecognizedMaterialItem item, String field) {
        return switch (field) {
            case "type" -> item.getType() == null || item.getType().isBlank();
            case "steel_type" -> item.getSteel_type() == null || item.getSteel_type().isBlank();
            case "length" -> item.getLength() <= 0;
            case "thickness" -> item.getThickness() <= 0;
            case "amount" -> item.getAmount() <= 0;
            case "monovalent" -> item.getMonovalent() <= 0;
            default -> false;
        };
    }

    private double defaultNumber(Double value) {
        return value == null ? 0.0 : value;
    }
}
