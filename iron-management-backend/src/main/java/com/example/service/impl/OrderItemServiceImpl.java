package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.domain.OrderItem;
import com.example.service.OrderItemService;
import com.example.mapper.OrderItemMapper;
import org.springframework.stereotype.Service;

/**
* @author 洛畔
* @description 针对表【order_item(单子上的每一块料)】的数据库操作Service实现
* @createDate 2025-09-06 15:34:26
*/
@Service
public class OrderItemServiceImpl extends ServiceImpl<OrderItemMapper, OrderItem>
    implements OrderItemService{

}




