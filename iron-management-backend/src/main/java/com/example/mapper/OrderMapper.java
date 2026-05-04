package com.example.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.domain.Order;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
* @author 洛畔
* @description 针对表【order(下的每一副材料)】的数据库操作Mapper
* @createDate 2025-09-01 21:42:10
* @Entity com.example.domain.Order
*/
public interface OrderMapper extends BaseMapper<Order> {

    @Select("<script>" +
            "SELECT o.id, o.customer_id, o.time, o.note, o.total_money, " +
            "o.paid_money, o.process_fee, c.id AS customer_id, " +
            "c.customer_name, c.telephone, c.address " +
            "FROM t_order o LEFT JOIN customer c ON o.customer_id = c.id " +
            "WHERE COALESCE(o.is_deleted, 0) = 0 AND COALESCE(c.is_deleted, 0) = 0 " +
            "<if test='customerId != null'> AND o.customer_id = #{customerId} </if>" +
            "<if test='month != null and month != \"\"'> AND DATE_FORMAT(o.time, '%Y-%m') = #{month} </if>" +
            "<if test='materialType != null and materialType != \"\"'> " +
            "AND EXISTS (SELECT 1 FROM order_item oi WHERE oi.order_id = o.id AND COALESCE(oi.is_deleted, 0) = 0 " +
            "AND ((#{materialType} = '未填写类型' AND (oi.type IS NULL OR oi.type = '')) OR oi.type = #{materialType})) " +
            "</if>" +
            "<if test='steelType != null and steelType != \"\"'> " +
            "AND EXISTS (SELECT 1 FROM order_item oi WHERE oi.order_id = o.id AND COALESCE(oi.is_deleted, 0) = 0 " +
            "AND ((#{steelType} = '未填写钢号' AND (oi.steel_type IS NULL OR oi.steel_type = '')) OR oi.steel_type = #{steelType})) " +
            "</if>" +
            "ORDER BY o.time DESC LIMIT #{offset}, #{pageSize}" +
            "</script>")
    List<Map<String, Object>> selectOrderWithCustomer(
            @Param("offset") long offset,
            @Param("pageSize") int pageSize,
            @Param("customerId") Long customerId,
            @Param("month") String month,
            @Param("materialType") String materialType,
            @Param("steelType") String steelType
    );

    @Select("<script>" +
            "SELECT COUNT(*) FROM t_order o " +
            "LEFT JOIN customer c ON o.customer_id = c.id " +
            "WHERE COALESCE(o.is_deleted, 0) = 0 AND COALESCE(c.is_deleted, 0) = 0 " +
            "<if test='customerId != null'> AND o.customer_id = #{customerId} </if>" +
            "<if test='month != null and month != \"\"'> AND DATE_FORMAT(o.time, '%Y-%m') = #{month} </if>" +
            "<if test='materialType != null and materialType != \"\"'> " +
            "AND EXISTS (SELECT 1 FROM order_item oi WHERE oi.order_id = o.id AND COALESCE(oi.is_deleted, 0) = 0 " +
            "AND ((#{materialType} = '未填写类型' AND (oi.type IS NULL OR oi.type = '')) OR oi.type = #{materialType})) " +
            "</if>" +
            "<if test='steelType != null and steelType != \"\"'> " +
            "AND EXISTS (SELECT 1 FROM order_item oi WHERE oi.order_id = o.id AND COALESCE(oi.is_deleted, 0) = 0 " +
            "AND ((#{steelType} = '未填写钢号' AND (oi.steel_type IS NULL OR oi.steel_type = '')) OR oi.steel_type = #{steelType})) " +
            "</if>" +
            "</script>")
    long selectOrderCount(
            @Param("customerId") Long customerId,
            @Param("month") String month,
            @Param("materialType") String materialType,
            @Param("steelType") String steelType
    );
}




