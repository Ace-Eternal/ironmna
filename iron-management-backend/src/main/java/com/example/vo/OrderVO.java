package com.example.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO {
    private Long customer_id; //客户下拉列表 顺便携带客户id
    private String note;
    private Double process_fee;
    private OrderItemVO[] orderItems;
}
