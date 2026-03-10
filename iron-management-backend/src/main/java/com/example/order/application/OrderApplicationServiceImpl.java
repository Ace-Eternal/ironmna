package com.example.order.application;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.example.common.exception.BusinessException;
import com.example.common.file.GeneratedFile;
import com.example.common.service.DocumentTemplateService;
import com.example.domain.Customer;
import com.example.domain.Order;
import com.example.domain.OrderItem;
import com.example.dto.PageResult;
import com.example.service.CustomerService;
import com.example.service.OrderItemService;
import com.example.service.OrderService;
import com.example.util.Calculate;
import com.example.util.NowDate;
import com.example.vo.OrderItemVO;
import com.example.vo.OrderVO;
import com.example.vo.UpdateOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderApplicationServiceImpl implements OrderApplicationService {

    private final OrderService orderService;
    private final OrderItemService orderItemService;
    private final CustomerService customerService;
    private final DocumentTemplateService documentTemplateService;

    @Override
    public PageResult getOrderList(int current, int pageSize) {
        return orderService.pageWithCustomer(current, pageSize);
    }

    @Override
    public Order getOrderDetail(int id) {
        Order order = getExistingOrder(id);
        Customer customer = getExistingCustomer(order.getCustomer_id());

        LambdaQueryWrapper<OrderItem> itemQuery = new LambdaQueryWrapper<>();
        itemQuery.eq(OrderItem::getOrder_id, id);
        List<OrderItem> orderItems = orderItemService.list(itemQuery);

        order.setCustomer(customer);
        order.setOrderItemList(orderItems);
        return order;
    }

    @Override
    @Transactional
    public Order createOrder(OrderVO orderVO) {
        validateCreateRequest(orderVO);

        Order order = new Order();
        order.setCustomer_id(orderVO.getCustomer_id());
        order.setCreate_time(NowDate.getNowDate());
        order.setTime(NowDate.getNowDate());
        order.setNote(orderVO.getNote());
        order.setProcess_fee(defaultMoney(orderVO.getProcess_fee()));
        order.setIs_deleted(0);
        orderService.save(order);

        double totalMoney = order.getProcess_fee();
        for (OrderItemVO itemVO : orderVO.getOrderItems()) {
            OrderItem orderItem = buildOrderItem(itemVO, order.getId());
            totalMoney += orderItem.getSteel_money();
            orderItemService.save(orderItem);
        }

        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", order.getId());
        updateWrapper.set("total_money", totalMoney);
        orderService.update(updateWrapper);

        return getOrderDetail(order.getId().intValue());
    }

    @Override
    public boolean deleteOrder(int orderId) {
        return orderService.removeById(orderId);
    }

    @Override
    @Transactional
    public boolean updateOrder(UpdateOrderVO updateOrderVO) {
        Integer orderId = Integer.parseInt(updateOrderVO.getOrder_id());
        Order existingOrder = getExistingOrder(orderId);

        Order order = new Order();
        order.setCustomer_id(updateOrderVO.getCustomer_id() == null ? existingOrder.getCustomer_id() : Long.valueOf(updateOrderVO.getCustomer_id()));
        order.setTime(updateOrderVO.getTime() == null ? existingOrder.getTime() : updateOrderVO.getTime());
        order.setUpdate_time(NowDate.getNowDate());
        order.setProcess_fee(defaultMoney(updateOrderVO.getProcess_fee()));
        order.setPaid_money(defaultMoney(updateOrderVO.getPaid_money()));
        order.setNote(updateOrderVO.getNote());

        double totalMoney = updateOrderVO.getTotal_money() == null
                ? defaultMoney(existingOrder.getTotal_money())
                : updateOrderVO.getTotal_money();

        if (updateOrderVO.getOrderItemVOs() != null && updateOrderVO.getOrderItemVOs().length > 0) {
            LambdaQueryWrapper<OrderItem> deleteWrapper = new LambdaQueryWrapper<>();
            deleteWrapper.eq(OrderItem::getOrder_id, orderId);
            orderItemService.remove(deleteWrapper);

            List<OrderItem> orderItems = new ArrayList<>();
            totalMoney = order.getProcess_fee();
            for (OrderItemVO itemVO : updateOrderVO.getOrderItemVOs()) {
                OrderItem orderItem = buildOrderItem(itemVO, Long.valueOf(orderId));
                orderItem.setUpdate_time(NowDate.getNowDate());
                orderItems.add(orderItem);
                totalMoney += orderItem.getSteel_money();
            }
            orderItemService.saveBatch(orderItems);
        }

        order.setTotal_money(totalMoney);

        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", orderId);
        return orderService.update(order, updateWrapper);
    }

    @Override
    public String exportOrderDocument(int id) {
        Order order = getOrderDetail(id);
        List<OrderItem> orderItems = order.getOrderItemList();
        orderItems.forEach(item -> {
            item.setTotal_weight(roundMoney(item.getTotal_weight()));
            item.setSteel_money(roundMoney(item.getSteel_money()));
        });

        String formattedDate = new SimpleDateFormat("yyyy-MM-dd").format(order.getTime());
        HashMap<String, Object> renderData = new HashMap<>();
        renderData.put("customer_name", order.getCustomer().getCustomer_name());
        renderData.put("time", formattedDate);
        renderData.put("orderItems", orderItems);
        renderData.put("process_fee", roundMoney(order.getProcess_fee()));
        renderData.put("total_money", roundMoney(order.getTotal_money()));

        return documentTemplateService.renderOrderDocument(order.getId(), renderData);
    }

    @Override
    public GeneratedFile downloadGeneratedFile(String fileName) {
        return documentTemplateService.loadGeneratedFile(fileName);
    }

    private Order getExistingOrder(Integer id) {
        Order order = orderService.getById(id);
        if (order == null) {
            throw new BusinessException("Order does not exist");
        }
        return order;
    }

    private Customer getExistingCustomer(Long customerId) {
        LambdaQueryWrapper<Customer> customerQuery = new LambdaQueryWrapper<>();
        customerQuery.eq(Customer::getId, customerId);
        Customer customer = customerService.getOne(customerQuery);
        if (customer == null) {
            throw new BusinessException("Customer does not exist");
        }
        return customer;
    }

    private void validateCreateRequest(OrderVO orderVO) {
        if (orderVO.getCustomer_id() == null || orderVO.getOrderItems() == null || orderVO.getOrderItems().length == 0) {
            throw new BusinessException("Order payload is incomplete");
        }
    }

    private OrderItem buildOrderItem(OrderItemVO itemVO, Long orderId) {
        OrderItem orderItem = new OrderItem();
        BeanUtils.copyProperties(itemVO, orderItem);
        orderItem.setOrder_id(orderId);
        orderItem.setCreate_time(NowDate.getNowDate());
        orderItem.setIs_deleted(0);

        double totalWeight = Calculate.calculate_weight(
                itemVO.getType(),
                itemVO.getAmount(),
                itemVO.getLength(),
                itemVO.getLength_remain(),
                itemVO.getWidth(),
                itemVO.getWidth_remain(),
                itemVO.getThickness(),
                itemVO.getThickness_remain()
        );
        orderItem.setTotal_weight(totalWeight);
        orderItem.setSteel_money(totalWeight * defaultMoney(itemVO.getMonovalent()) + defaultMoney(itemVO.getCut_fee()));
        return orderItem;
    }

    private double roundMoney(Double value) {
        return Math.round(defaultMoney(value) * 100.0) / 100.0;
    }

    private double defaultMoney(Double value) {
        return value == null ? 0.0 : value;
    }
}
