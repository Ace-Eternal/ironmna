package com.example.order.recognition;

import com.example.common.exception.BusinessException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenAiMaterialRecognitionProvider implements MaterialRecognitionProvider {

    private final MaterialRecognitionProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public String recognize(MaterialSheetImage image) {
        if (properties.getApiKey() == null || properties.getApiKey().isBlank()) {
            throw new BusinessException("Material recognition API key is not configured");
        }

        try {
            String requestBody = objectMapper.writeValueAsString(buildRequestBody(image));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(buildResponsesUrl()))
                    .timeout(Duration.ofSeconds(60))
                    .header("Authorization", "Bearer " + properties.getApiKey())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BusinessException("Material recognition provider failed: HTTP " + response.statusCode());
            }

            return extractOutputText(response.body());
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BusinessException("Material recognition provider failed: " + exception.getMessage());
        }
    }

    private Map<String, Object> buildRequestBody(MaterialSheetImage image) {
        String imageUrl = "data:%s;base64,%s".formatted(
                image.contentType(),
                Base64.getEncoder().encodeToString(image.content())
        );

        return Map.of(
                "model", properties.getModel(),
                "input", List.of(Map.of(
                        "role", "user",
                        "content", List.of(
                                Map.of("type", "input_text", "text", buildPrompt()),
                                Map.of("type", "input_image", "image_url", imageUrl)
                        )
                )),
                "text", Map.of("format", buildJsonSchema())
        );
    }

    private String buildPrompt() {
        return """
                你是钢材材料单识别助手。请直接阅读图片中的手写材料明细，不要使用 OCR 中间格式。
                只返回 JSON，不要解释。行数以图片可见材料行数为准，尽量保留原始顺序。
                字段规则：
                1. type 只能是 方钢 或 圆钢；不能确定时填 null，并把 type 加入 needsReviewFields。
                2. steel_type 只能从允许钢号中选择；不能确定或不在列表时填 null，并把 steel_type 加入 needsReviewFields。
                3. length_remain、width_remain、thickness_remain、cut_fee 缺省时填 0。
                4. 圆钢 width 和 width_remain 填 0。
                5. type、steel_type、length、thickness、amount、monovalent 不明确时必须加入 needsReviewFields。
                6. fieldConfidences 使用 0 到 1 的数字表达每个字段可信度。
                允许钢号：45#, 50#, P20, P20H, 718, 718H, H13, H13R, 40Cr, 4Cr13, Cr12, Cr12正材, 2083, S136, S136H, NAK80, Cr12MoV, SKD61, SKD11, DC53。
                """;
    }

    private Map<String, Object> buildJsonSchema() {
        Map<String, Object> numberSchema = Map.of("type", List.of("number", "null"));
        Map<String, Object> stringSchema = Map.of("type", List.of("string", "null"));

        return Map.of(
                "type", "json_schema",
                "name", "material_sheet_recognition",
                "strict", true,
                "schema", Map.of(
                        "type", "object",
                        "additionalProperties", false,
                        "required", List.of("items", "overallConfidence", "warnings"),
                        "properties", Map.of(
                                "overallConfidence", Map.of("type", "number"),
                                "warnings", Map.of("type", "array", "items", Map.of("type", "string")),
                                "items", Map.of(
                                        "type", "array",
                                        "items", Map.of(
                                                "type", "object",
                                                "additionalProperties", false,
                                                "required", List.of(
                                                        "rowIndex", "type", "steel_type", "length", "length_remain",
                                                        "width", "width_remain", "thickness", "thickness_remain",
                                                        "amount", "monovalent", "cut_fee", "note",
                                                        "fieldConfidences", "needsReviewFields", "sourceNote"
                                                ),
                                                "properties", Map.ofEntries(
                                                        Map.entry("rowIndex", Map.of("type", "integer")),
                                                        Map.entry("type", stringSchema),
                                                        Map.entry("steel_type", stringSchema),
                                                        Map.entry("length", numberSchema),
                                                        Map.entry("length_remain", numberSchema),
                                                        Map.entry("width", numberSchema),
                                                        Map.entry("width_remain", numberSchema),
                                                        Map.entry("thickness", numberSchema),
                                                        Map.entry("thickness_remain", numberSchema),
                                                        Map.entry("amount", Map.of("type", List.of("integer", "null"))),
                                                        Map.entry("monovalent", numberSchema),
                                                        Map.entry("cut_fee", numberSchema),
                                                        Map.entry("note", stringSchema),
                                                        Map.entry("fieldConfidences", buildFieldConfidenceSchema()),
                                                        Map.entry("needsReviewFields", Map.of(
                                                                "type", "array",
                                                                "items", Map.of("type", "string")
                                                        )),
                                                        Map.entry("sourceNote", stringSchema)
                                                )
                                        )
                                )
                        )
                )
        );
    }

    private Map<String, Object> buildFieldConfidenceSchema() {
        Map<String, Object> confidenceValueSchema = Map.of("type", "number");
        return Map.of(
                "type", "object",
                "additionalProperties", false,
                "required", List.of(
                        "type", "steel_type", "length", "length_remain", "width", "width_remain",
                        "thickness", "thickness_remain", "amount", "monovalent", "cut_fee", "note"
                ),
                "properties", Map.ofEntries(
                        Map.entry("type", confidenceValueSchema),
                        Map.entry("steel_type", confidenceValueSchema),
                        Map.entry("length", confidenceValueSchema),
                        Map.entry("length_remain", confidenceValueSchema),
                        Map.entry("width", confidenceValueSchema),
                        Map.entry("width_remain", confidenceValueSchema),
                        Map.entry("thickness", confidenceValueSchema),
                        Map.entry("thickness_remain", confidenceValueSchema),
                        Map.entry("amount", confidenceValueSchema),
                        Map.entry("monovalent", confidenceValueSchema),
                        Map.entry("cut_fee", confidenceValueSchema),
                        Map.entry("note", confidenceValueSchema)
                )
        );
    }

    private String buildResponsesUrl() {
        String baseUrl = properties.getBaseUrl();
        return baseUrl.endsWith("/") ? baseUrl + "responses" : baseUrl + "/responses";
    }

    private String extractOutputText(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode outputText = root.get("output_text");
        if (outputText != null && outputText.isTextual()) {
            return outputText.asText();
        }

        JsonNode output = root.path("output");
        if (output.isArray()) {
            for (JsonNode item : output) {
                JsonNode content = item.path("content");
                if (!content.isArray()) {
                    continue;
                }
                for (JsonNode part : content) {
                    JsonNode text = part.get("text");
                    if (text != null && text.isTextual()) {
                        return text.asText();
                    }
                }
            }
        }

        throw new BusinessException("Material recognition provider returned no structured output");
    }
}
