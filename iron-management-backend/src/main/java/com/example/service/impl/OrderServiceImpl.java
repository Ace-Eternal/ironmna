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
        // 计算分页偏移量
        long offset = (long) (current - 1) * pageSize;

        // 查询当前页数据
        List<Map<String, Object>> records = orderMapper.selectOrderWithCustomer(offset, pageSize);

        // 查询总记录数
        long total = orderMapper.selectOrderCount();

        // 构建分页结果
        return new PageResult(records, total, current, pageSize);
    }
}




