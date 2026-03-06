package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
import com.example.domain.Customer;
import com.example.domain.Order;
import com.example.domain.OrderItem;
import com.example.dto.PageResult;
import com.example.dto.Result;
import com.example.service.CustomerService;
import com.example.service.OrderItemService;
import com.example.service.OrderService;
import com.example.util.Calculate;
import com.example.util.NowDate;
import com.example.vo.OrderItemVO;
import com.example.vo.OrderVO;
import com.example.vo.UpdateOrderVO;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * 用户的订单
 *
 * @return
 */
@RequestMapping("/order")
@RestController
@CrossOrigin("*")
public class OrderController {

    @Resource
    OrderService orderService;

    @Resource
    OrderItemService orderItemService;

    @Resource
    CustomerService customerService;

    /**
     * 获取所有订单
     *
     * @return
     */
    @GetMapping("/getOrderList")
    public Result getList(@RequestParam Integer current, @RequestParam Integer pageSize) {

        PageResult pageResult = orderService.pageWithCustomer(current, pageSize);

        return pageResult != null ? Result.ok("获取账单成功", pageResult) : Result.fail("获取账单失败");

    }

    @GetMapping("/getOrderDetail")
    public Result getOrderDetail(@RequestParam Integer id) {
        // 1. 查询订单基础信息
        Order order = orderService.getById(id);
        if (order == null) {
            return Result.fail("订单不存在");
        }
        // 2. 查询关联的客户信息
        LambdaQueryWrapper<Customer> customerQuery = new LambdaQueryWrapper<>();
        customerQuery.eq(Customer::getId, order.getCustomer_id());
        Customer customer = customerService.getOne(customerQuery);
        order.setCustomer(customer);
        // 3. 查询关联的订单项列表
        LambdaQueryWrapper<OrderItem> itemQuery = new LambdaQueryWrapper<>();
        itemQuery.eq(OrderItem::getOrder_id, id);
        List<OrderItem> orderItems = orderItemService.list(itemQuery);
        order.setOrderItemList(orderItems); // 确保字段名和 setter 方法一致！
        return Result.ok("获取订单详情成功", order);
    }

    /*
     * 创建订单
     */
    @PostMapping("/createOrder")
    public Result createOrder(@RequestBody OrderVO orderVO) {
        if (orderVO.getProcess_fee() == null || orderVO.getCustomer_id() == null || orderVO.getOrderItems() == null) {
            return Result.fail("有未填的信息请检查");
        }
        Order order = new Order();
        // 根据客户id/名字创建订单
        order.setCustomer_id(Long.valueOf(orderVO.getCustomer_id()));
        order.setCreate_time(NowDate.getNowDate());
        order.setTime(NowDate.getNowDate());
        order.setNote(orderVO.getNote());
        order.setProcess_fee(orderVO.getProcess_fee());
        order.setIs_deleted(0);
        orderService.save(order);
        double total_money = 0.0;
        if (orderVO.getProcess_fee() != null) {
            total_money += orderVO.getProcess_fee();
        }

        for (OrderItemVO item : orderVO.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setCreate_time(NowDate.getNowDate());
            orderItem.setOrder_id(order.getId());
            // 根据创建的order把orderitems填充进去
            orderItem.setType(item.getType());
            orderItem.setSteel_type(item.getSteel_type());
            // 长宽高
            orderItem.setLength(item.getLength());
            orderItem.setLength_remain(item.getLength_remain());
            orderItem.setWidth(item.getWidth());
            orderItem.setWidth_remain(item.getWidth_remain());
            orderItem.setThickness(item.getThickness());
            orderItem.setThickness_remain(item.getThickness_remain());
            // 单价
            orderItem.setMonovalent(item.getMonovalent());
            // 数量
            orderItem.setAmount(item.getAmount());
            // 备注
            orderItem.setNote(item.getNote());
            // 刀费
            orderItem.setCut_fee(item.getCut_fee());
            // 计算重量
            double weight = Calculate.calculate_weight(item.getType(), item.getAmount(), item.getLength(),
                    item.getLength_remain(), item.getWidth(), item.getWidth_remain(), item.getThickness(),
                    item.getThickness_remain());
            orderItem.setTotal_weight(weight);
            // 计算金额算上刀费 不算加工费
            double steel_money = weight * item.getMonovalent() + item.getCut_fee();
            orderItem.setSteel_money(steel_money);
            // 计算总金额
            total_money += steel_money;
            // 保存orderitem
            orderItemService.save(orderItem);
        }
        // 计算订单total_money
        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", order.getId());
        updateWrapper.set("total_money", total_money);
        boolean b = orderService.update(updateWrapper);

        return b ? Result.ok("创建订单成功", orderService.getById(order.getId())) : Result.fail("创建订单失败");
    }

    /*
     * 删除订单
     */
    @PostMapping("/deleteOrder")
    public Result deleteOrder(@RequestParam Integer orderId) {
        boolean b = orderService.removeById(orderId);
        return b ? Result.ok("删除订单成功", b) : Result.fail("删除订单失败");
    }

    @PostMapping("/updateOrder")
    public Result updateOrder(@RequestBody UpdateOrderVO updateOrderVO) {
        // 更新Order
        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        Integer orderId = Integer.parseInt(updateOrderVO.getOrder_id());
        updateWrapper.eq("id", orderId);
        Order order = new Order();
        order.setCustomer_id(order.getCustomer_id());
        order.setTime(order.getTime());
        order.setUpdate_time(NowDate.getNowDate());
        order.setProcess_fee(updateOrderVO.getProcess_fee());
        order.setTotal_money(updateOrderVO.getTotal_money());
        order.setPaid_money(updateOrderVO.getPaid_money());
        order.setNote(updateOrderVO.getNote());
        boolean b = orderService.update(order, updateWrapper);

        // 更新OrderItems
        if (updateOrderVO.getOrderItemVOs() != null && updateOrderVO.getOrderItemVOs().length > 0) {
            // 先删除该订单原有的所有订单项
            LambdaQueryWrapper<OrderItem> deleteWrapper = new LambdaQueryWrapper<>();
            deleteWrapper.eq(OrderItem::getOrder_id, orderId);
            orderItemService.remove(deleteWrapper);
            // 创建新的订单项列表
            List<OrderItem> orderItems = new ArrayList<>();

            for (OrderItemVO itemVO : updateOrderVO.getOrderItemVOs()) {
                OrderItem item = new OrderItem();
                BeanUtils.copyProperties(itemVO, item); // 复制属性

                // 这里可以计算需要计算的字段
                double totalWeight = Calculate.calculate_weight(itemVO.getType(), itemVO.getAmount(),
                        itemVO.getLength(), itemVO.getLength_remain(), itemVO.getWidth(), itemVO.getWidth_remain(),
                        itemVO.getThickness(), itemVO.getThickness_remain()); // 计算总重量
                item.setTotal_weight(totalWeight);

                // 设置系统自动生成的字段
                item.setOrder_id(Long.valueOf(orderId));
                item.setCreate_time(NowDate.getNowDate());
                item.setUpdate_time(NowDate.getNowDate());
                item.setIs_deleted(0);

                orderItems.add(item);
            }

            // 批量保存所有订单项
            orderItemService.saveBatch(orderItems);

        }

        return b ? Result.ok("订单更新成功", b) : Result.fail("订单更新失败");

    }

    @PostMapping("/exportOrder")
    public Result exportOrder(@RequestParam Integer id) throws IOException {
        // 1. 查询订单基础信息
        Order order = orderService.getById(id);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        // 2. 查询关联的客户信息
        LambdaQueryWrapper<Customer> customerQuery = new LambdaQueryWrapper<>();
        customerQuery.eq(Customer::getId, order.getCustomer_id());
        Customer customer = customerService.getOne(customerQuery);
        // 3. 查询关联的订单项列表
        LambdaQueryWrapper<OrderItem> itemQuery = new LambdaQueryWrapper<>();
        itemQuery.eq(OrderItem::getOrder_id, id);
        List<OrderItem> orderItems = orderItemService.list(itemQuery);
        orderItems.forEach(item -> {
            item.setTotal_weight(Math.round(item.getTotal_weight() * 100.0) / 100.0);
            item.setSteel_money(Math.round(item.getSteel_money() * 100.0) / 100.0);
        });

        // 循环
        LoopRowTableRenderPolicy policy = new LoopRowTableRenderPolicy();
        Configure config = Configure.builder()
                .bind("orderItems", policy).build();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = sdf.format(order.getTime());
        XWPFTemplate template = XWPFTemplate.compile("/home/ubuntu/ironman/react/template.docx", config).render(
                new HashMap<String, Object>() {
                    {
                        put("customer_name", customer.getCustomer_name());
                        put("time", formattedDate);
                        put("orderItems", orderItems);
                        put("process_fee", order.getProcess_fee());
                        put("total_money", Math.round(order.getTotal_money() * 100.0) / 100.0);
                    }
                });
        template.write(out);
        template.close();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        headers.add(HttpHeaders.PRAGMA, "no-cache");
        headers.add(HttpHeaders.EXPIRES, "0");
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=order_" + order.getId() + ".docx");

        String fileName = "order_" + id + ".docx";
        String tempDir = System.getProperty("java.io.tmpdir");
        String filePath = tempDir + File.separator + fileName;

        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(out.toByteArray());
        }

        // 返回文件下载链接
        return Result.ok("文档生成成功", fileName);
    }

    @GetMapping("/download")
    public ResponseEntity<Object> downloadFile(@RequestParam String file) {
        String tempDir = System.getProperty("java.io.tmpdir");
        Path filePath = Paths.get(tempDir).resolve(file);
        File downloadFile = filePath.toFile();

        if (!downloadFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Result.fail("文件不存在"));
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(downloadFile));

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file);
            headers.add(HttpHeaders.CONTENT_TYPE,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(downloadFile.length())
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Result.fail("文件下载失败：" + e.getMessage()));
        }
    }
}
