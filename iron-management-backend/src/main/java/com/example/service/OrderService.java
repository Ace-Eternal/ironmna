package com.example.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.domain.Order;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.dto.PageResult;

/**
* @author 洛畔
* @description 针对表【order(下的每一副材料)】的数据库操作Service
* @createDate 2025-09-01 21:42:10
*/
public interface OrderService extends IService<Order> {
    public PageResult pageWithCustomer(int current, int pageSize);
}
