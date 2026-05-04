package com.example.vo;

import lombok.Data;

import java.util.List;

@Data
public class DashboardHomeVO {
    private Summary summary;
    private List<MonthlyTrend> monthlyTrend;
    private List<CustomerRanking> customerRanking;
    private List<MaterialTypeShare> materialTypeShare;
    private List<SteelTypeRanking> steelTypeRanking;
    private List<RecentOrder> recentOrders;

    @Data
    public static class Summary {
        private Long orderCount;
        private Long customerCount;
        private Long itemCount;
        private Double totalWeight;
        private Double totalMoney;
    }

    @Data
    public static class MonthlyTrend {
        private String month;
        private Long orderCount;
        private Double totalMoney;
    }

    @Data
    public static class CustomerRanking {
        private Long customerId;
        private String customerName;
        private Long orderCount;
        private Double totalMoney;
    }

    @Data
    public static class MaterialTypeShare {
        private String materialType;
        private Long itemCount;
        private Long amount;
        private Double totalWeight;
        private Double steelMoney;
    }

    @Data
    public static class SteelTypeRanking {
        private String steelType;
        private Long itemCount;
        private Long amount;
        private Double totalWeight;
        private Double steelMoney;
    }

    @Data
    public static class RecentOrder {
        private Long orderId;
        private String customerName;
        private String orderDate;
        private Double totalMoney;
        private Double processFee;
        private Long itemCount;
        private Double totalWeight;
    }
}
