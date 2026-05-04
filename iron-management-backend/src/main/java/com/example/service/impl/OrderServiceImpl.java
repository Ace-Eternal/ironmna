package com.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.domain.Customer;
import com.example.domain.Order;
import com.example.dto.PageResult;
import com.example.service.CustomerService;
import com.example.service.OrderService;
import com.example.mapper.OrderMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
* @author 洛畔
* @description 针对表【order(下的每一副材料)】的数据库操作Service实现
* @createDate 2025-09-01 21:42:10
*/
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order>
    implements OrderService{

    @Resource
    CustomerService customerService;

    @Resource
    OrderMapper orderMapper;

    @Override
    public PageResult pageWithCustomer(int current, int pageSize) {
        return pageWithCustomer(current, pageSize, null, null, null, null);
    }

    @Override
    public PageResult pageWithCustomer(int current, int pageSize, Long customerId, String month, String materialType, String steelType) {
        // 计算分页偏移量，并透传首页图表带来的筛选条件。
        long offset = (long) (current - 1) * pageSize;

        List<Map<String, Object>> records = orderMapper.selectOrderWithCustomer(
                offset,
                pageSize,
                customerId,
                month,
                normalizeFilter(materialType),
                normalizeFilter(steelType)
        );

        long total = orderMapper.selectOrderCount(
                customerId,
                month,
                normalizeFilter(materialType),
                normalizeFilter(steelType)
        );

        return new PageResult(records, total, current, pageSize);
    }

    private String normalizeFilter(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}




