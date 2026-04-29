package com.example.order.recognition;

import com.example.common.exception.BusinessException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MaterialSheetRecognitionServiceTest {

    @Test
    void recognizeNormalizesStandardProviderJson() {
        MaterialSheetRecognitionService service = buildService("""
                {
                  "overallConfidence": 0.86,
                  "warnings": [],
                  "items": [{
                    "rowIndex": 1,
                    "type": "方钢",
                    "steel_type": "P20",
                    "length": 100,
                    "length_remain": null,
                    "width": 50,
                    "width_remain": null,
                    "thickness": 20,
                    "thickness_remain": null,
                    "amount": 2,
                    "monovalent": 8.5,
                    "cut_fee": null,
                    "note": "急",
                    "fieldConfidences": {"type": 0.9},
                    "needsReviewFields": [],
                    "sourceNote": "第一行"
                  }]
                }
                """);

        MaterialSheetRecognitionResult result = service.recognize(imageFile());

        assertThat(result.getOverallConfidence()).isEqualTo(0.86);
        assertThat(result.getItems()).hasSize(1);
        RecognizedMaterialItem item = result.getItems().get(0);
        assertThat(item.getType()).isEqualTo("方钢");
        assertThat(item.getSteel_type()).isEqualTo("P20");
        assertThat(item.getLength_remain()).isZero();
        assertThat(item.getWidth_remain()).isZero();
        assertThat(item.getThickness_remain()).isZero();
        assertThat(item.getCut_fee()).isZero();
        assertThat(item.getNeedsReviewFields()).isEmpty();
    }

    @Test
    void recognizeMarksOutOfListValuesForReview() {
        MaterialSheetRecognitionService service = buildService("""
                {
                  "overallConfidence": 0.42,
                  "warnings": [],
                  "items": [{
                    "rowIndex": 1,
                    "type": "扁钢",
                    "steel_type": "P2O",
                    "length": 0,
                    "length_remain": 0,
                    "width": 10,
                    "width_remain": 0,
                    "thickness": 5,
                    "thickness_remain": 0,
                    "amount": 1,
                    "monovalent": 0,
                    "cut_fee": 0,
                    "note": null,
                    "fieldConfidences": {},
                    "needsReviewFields": [],
                    "sourceNote": "疑似第一行"
                  }]
                }
                """);

        MaterialSheetRecognitionResult result = service.recognize(imageFile());
        RecognizedMaterialItem item = result.getItems().get(0);

        assertThat(item.getType()).isNull();
        assertThat(item.getSteel_type()).isNull();
        assertThat(item.getNeedsReviewFields()).contains("type", "steel_type", "length", "monovalent");
        assertThat(result.getWarnings()).contains("第 1 行材料类型不在允许列表：扁钢", "第 1 行钢号不在允许列表：P2O");
    }

    @Test
    void recognizeDefaultsRoundSteelWidthToZero() {
        MaterialSheetRecognitionService service = buildService("""
                {
                  "overallConfidence": 0.9,
                  "warnings": [],
                  "items": [{
                    "rowIndex": 1,
                    "type": "圆钢",
                    "steel_type": "45#",
                    "length": 100,
                    "length_remain": 5,
                    "width": 30,
                    "width_remain": 2,
                    "thickness": 20,
                    "thickness_remain": 1,
                    "amount": 3,
                    "monovalent": 9,
                    "cut_fee": 0,
                    "note": null,
                    "fieldConfidences": {},
                    "needsReviewFields": [],
                    "sourceNote": null
                  }]
                }
                """);

        RecognizedMaterialItem item = service.recognize(imageFile()).getItems().get(0);

        assertThat(item.getWidth()).isZero();
        assertThat(item.getWidth_remain()).isZero();
    }

    @Test
    void recognizeRejectsInvalidProviderJson() {
        MaterialSheetRecognitionService service = buildService("not-json");

        assertThatThrownBy(() -> service.recognize(imageFile()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("材料单识别结果格式错误");
    }

    @Test
    void recognizeRejectsUnsupportedImageType() {
        MaterialSheetRecognitionService service = buildService("{}");
        MockMultipartFile file = new MockMultipartFile("file", "sheet.txt", "text/plain", "x".getBytes());

        assertThatThrownBy(() -> service.recognize(file))
                .isInstanceOf(BusinessException.class)
                .hasMessage("仅支持 JPG、PNG、WEBP 图片");
    }

    private MaterialSheetRecognitionService buildService(String providerJson) {
        MaterialRecognitionProperties properties = new MaterialRecognitionProperties();
        return new MaterialSheetRecognitionService(image -> providerJson, properties, new ObjectMapper());
    }

    private MockMultipartFile imageFile() {
        return new MockMultipartFile("file", "sheet.jpg", "image/jpeg", new byte[]{1, 2, 3});
    }
}
