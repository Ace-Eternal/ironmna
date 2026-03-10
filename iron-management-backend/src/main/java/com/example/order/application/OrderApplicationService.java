package com.example.order.application;

import com.example.common.file.GeneratedFile;
import com.example.domain.Order;
import com.example.dto.PageResult;
import com.example.vo.OrderVO;
import com.example.vo.UpdateOrderVO;

public interface OrderApplicationService {
    PageResult getOrderList(int current, int pageSize);

    Order getOrderDetail(int id);

    Order createOrder(OrderVO orderVO);

    boolean deleteOrder(int orderId);

    boolean updateOrder(UpdateOrderVO updateOrderVO);

    String exportOrderDocument(int id);

    GeneratedFile downloadGeneratedFile(String fileName);
}
