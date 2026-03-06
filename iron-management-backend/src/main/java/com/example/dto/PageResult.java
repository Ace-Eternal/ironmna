package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult {
    private List<Map<String, Object>> records; // 当前页数据
    private long total;                       // 总记录数
    private int current;                      // 当前页码
    private int pageSize;
}
