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

    @Select("SELECT o.id, o.customer_id, o.time, o.note, o.total_money, " +
            "o.paid_money, o.process_fee, c.id AS customer_id, " +
            "c.customer_name, c.telephone, c.address " +
            "FROM t_order o LEFT JOIN customer c ON o.customer_id = c.id " +
            "WHERE o.is_deleted = 0 AND c.is_deleted = 0 " +
            "ORDER BY o.time DESC LIMIT #{offset}, #{pageSize}")
    List<Map<String, Object>> selectOrderWithCustomer(
            @Param("offset") long offset,
            @Param("pageSize") int pageSize
    );

    @Select("SELECT COUNT(*) FROM t_order o " +
            "LEFT JOIN customer c ON o.customer_id = c.id " +
            "WHERE o.is_deleted = 0 AND c.is_deleted = 0")
    long selectOrderCount();
}




