package com.example.mapper;

import com.example.vo.DashboardHomeVO;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface DashboardMapper {

    @Select("SELECT " +
            "(SELECT COUNT(*) FROM t_order WHERE COALESCE(is_deleted, 0) = 0) AS orderCount, " +
            "(SELECT COUNT(*) FROM customer WHERE COALESCE(is_deleted, 0) = 0) AS customerCount, " +
            "(SELECT COUNT(*) FROM order_item oi JOIN t_order o ON o.id = oi.order_id AND COALESCE(o.is_deleted, 0) = 0 WHERE COALESCE(oi.is_deleted, 0) = 0) AS itemCount, " +
            "(SELECT ROUND(COALESCE(SUM(oi.total_weight), 0), 2) FROM order_item oi JOIN t_order o ON o.id = oi.order_id AND COALESCE(o.is_deleted, 0) = 0 WHERE COALESCE(oi.is_deleted, 0) = 0) AS totalWeight, " +
            "(SELECT ROUND(COALESCE(SUM(total_money), 0), 2) FROM t_order WHERE COALESCE(is_deleted, 0) = 0) AS totalMoney")
    DashboardHomeVO.Summary selectSummary();

    @Select("SELECT DATE_FORMAT(time, '%Y-%m') AS month, " +
            "COUNT(*) AS orderCount, " +
            "ROUND(COALESCE(SUM(total_money), 0), 2) AS totalMoney " +
            "FROM t_order " +
            "WHERE COALESCE(is_deleted, 0) = 0 " +
            "GROUP BY DATE_FORMAT(time, '%Y-%m') " +
            "ORDER BY month")
    List<DashboardHomeVO.MonthlyTrend> selectMonthlyTrend();

    @Select("SELECT c.id AS customerId, " +
            "c.customer_name AS customerName, " +
            "COUNT(o.id) AS orderCount, " +
            "ROUND(COALESCE(SUM(o.total_money), 0), 2) AS totalMoney " +
            "FROM customer c " +
            "LEFT JOIN t_order o ON o.customer_id = c.id AND COALESCE(o.is_deleted, 0) = 0 " +
            "WHERE COALESCE(c.is_deleted, 0) = 0 " +
            "GROUP BY c.id, c.customer_name " +
            "ORDER BY totalMoney DESC, orderCount DESC, c.id ASC " +
            "LIMIT 10")
    List<DashboardHomeVO.CustomerRanking> selectCustomerRanking();

    @Select("SELECT CASE WHEN type IS NULL OR type = '' THEN '未填写类型' ELSE type END AS materialType, " +
            "COUNT(*) AS itemCount, " +
            "COALESCE(SUM(amount), 0) AS amount, " +
            "ROUND(COALESCE(SUM(total_weight), 0), 2) AS totalWeight, " +
            "ROUND(COALESCE(SUM(steel_money), 0), 2) AS steelMoney " +
            "FROM order_item oi " +
            "JOIN t_order o ON o.id = oi.order_id AND COALESCE(o.is_deleted, 0) = 0 " +
            "WHERE COALESCE(oi.is_deleted, 0) = 0 " +
            "GROUP BY CASE WHEN type IS NULL OR type = '' THEN '未填写类型' ELSE type END " +
            "ORDER BY steelMoney DESC")
    List<DashboardHomeVO.MaterialTypeShare> selectMaterialTypeShare();

    @Select("SELECT CASE WHEN steel_type IS NULL OR steel_type = '' THEN '未填写钢号' ELSE steel_type END AS steelType, " +
            "COUNT(*) AS itemCount, " +
            "COALESCE(SUM(amount), 0) AS amount, " +
            "ROUND(COALESCE(SUM(total_weight), 0), 2) AS totalWeight, " +
            "ROUND(COALESCE(SUM(steel_money), 0), 2) AS steelMoney " +
            "FROM order_item oi " +
            "JOIN t_order o ON o.id = oi.order_id AND COALESCE(o.is_deleted, 0) = 0 " +
            "WHERE COALESCE(oi.is_deleted, 0) = 0 " +
            "GROUP BY CASE WHEN steel_type IS NULL OR steel_type = '' THEN '未填写钢号' ELSE steel_type END " +
            "ORDER BY steelMoney DESC " +
            "LIMIT 10")
    List<DashboardHomeVO.SteelTypeRanking> selectSteelTypeRanking();

    @Select("SELECT o.id AS orderId, " +
            "c.customer_name AS customerName, " +
            "DATE_FORMAT(o.time, '%Y-%m-%d') AS orderDate, " +
            "ROUND(COALESCE(o.total_money, 0), 2) AS totalMoney, " +
            "ROUND(COALESCE(o.process_fee, 0), 2) AS processFee, " +
            "COUNT(oi.id) AS itemCount, " +
            "ROUND(COALESCE(SUM(oi.total_weight), 0), 2) AS totalWeight " +
            "FROM t_order o " +
            "LEFT JOIN customer c ON c.id = o.customer_id AND COALESCE(c.is_deleted, 0) = 0 " +
            "LEFT JOIN order_item oi ON oi.order_id = o.id AND COALESCE(oi.is_deleted, 0) = 0 " +
            "WHERE COALESCE(o.is_deleted, 0) = 0 " +
            "GROUP BY o.id, c.customer_name, o.time, o.total_money, o.process_fee " +
            "ORDER BY o.time DESC, o.id DESC " +
            "LIMIT 8")
    List<DashboardHomeVO.RecentOrder> selectRecentOrders();
}
