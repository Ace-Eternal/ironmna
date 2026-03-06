package com.example.util;

import com.example.domain.OrderItem;

public class Calculate {
    public static double calculate_weight(String type, Integer amount, Double length, Double length_remain, Double width, Double width_remain, Double thickness, Double thickness_remain){
        if (type.equals("方钢")){
            return amount * (length + length_remain) * (width + width_remain) * (thickness + thickness_remain) * 7.85 /1000000;
        } else if (type.equals("圆钢")) {
            return amount * (thickness + thickness_remain) * (thickness + thickness_remain) * (length + length_remain) * 0.006167 / 1000;
        }else{
            return 0.0;
        }
    }
}
