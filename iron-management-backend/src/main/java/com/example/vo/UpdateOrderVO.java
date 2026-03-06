package com.example.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderVO {
    private String order_id;
    private String customer_id;
    private Date time;
    private Double process_fee;
    private Double total_money;
    private Double paid_money;
    private String note;
    private OrderItemVO[] orderItemVOs;
}
