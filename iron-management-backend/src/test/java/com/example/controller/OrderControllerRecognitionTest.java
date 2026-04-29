package com.example.controller;

import com.example.order.application.OrderApplicationService;
import com.example.order.recognition.MaterialSheetRecognitionResult;
import com.example.order.recognition.MaterialSheetRecognitionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class OrderControllerRecognitionTest {

    private MockMvc mockMvc;
    private OrderApplicationService orderApplicationService;
    private MaterialSheetRecognitionService materialSheetRecognitionService;

    @BeforeEach
    void setUp() {
        orderApplicationService = mock(OrderApplicationService.class);
        materialSheetRecognitionService = mock(MaterialSheetRecognitionService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new OrderController(orderApplicationService, materialSheetRecognitionService))
                .build();
    }

    @Test
    void recognizeMaterialSheetReturnsRecognitionResult() throws Exception {
        MaterialSheetRecognitionResult recognitionResult = new MaterialSheetRecognitionResult();
        recognitionResult.setOverallConfidence(0.8);
        when(materialSheetRecognitionService.recognize(any())).thenReturn(recognitionResult);

        MockMultipartFile file = new MockMultipartFile("file", "sheet.jpg", "image/jpeg", new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/order/recognizeMaterialSheet").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.overallConfidence").value(0.8));
    }
}
