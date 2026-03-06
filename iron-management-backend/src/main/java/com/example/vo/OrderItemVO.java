package com.example.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemVO {
    private String type;
    private String steel_type;
    private double length;
    private double length_remain;
    private double width;
    private double width_remain;
    private double thickness;
    private double thickness_remain;
    private int amount;
    private String note;
    private double monovalent;
    private double cut_fee;

}
