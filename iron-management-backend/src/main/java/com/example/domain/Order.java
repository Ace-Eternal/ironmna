package com.example.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 下的每一副材料
 * @TableName order
 */
@TableName(value ="t_order")
@Data
public class Order implements Serializable {
    /**
     * 
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 外键 是哪一个客户的单子

     */
    @TableField(value = "customer_id")
    private Long customer_id;

    /**
     * 
     */
    @TableField(value = "create_time")
    private Date create_time;

    /**
     * 
     */
    @TableField(value = "update_time")
    private Date update_time;

    /**
     * 
     */
    @TableField(value = "is_deleted")
    private Integer is_deleted;

    /**
     * 写在单子上的日期

     */
    @TableField(value = "time")
    private Date time;

    /**
     * 备注

     */
    @TableField(value = "note")
    private String note;

    /**
     * 写下单子最下面的总金额

     */
    @TableField(value = "total_money")
    private Double total_money;

    /**
     * 已经支付的金额

     */
    @TableField(value = "paid_money")
    private Double paid_money;

    /**
     * 加工费

     */
    @TableField(value = "process_fee")
    private Double process_fee;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    // 2. 使用 @TableField(exist = false) 声明非数据库字段
    @TableField(exist = false)
    private Customer customer;

    @TableField(exist = false)
    private List<OrderItem> orderItemList;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Order other = (Order) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getCustomer_id() == null ? other.getCustomer_id() == null : this.getCustomer_id().equals(other.getCustomer_id()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()))
            && (this.getIs_deleted() == null ? other.getIs_deleted() == null : this.getIs_deleted().equals(other.getIs_deleted()))
            && (this.getTime() == null ? other.getTime() == null : this.getTime().equals(other.getTime()))
            && (this.getNote() == null ? other.getNote() == null : this.getNote().equals(other.getNote()))
            && (this.getTotal_money() == null ? other.getTotal_money() == null : this.getTotal_money().equals(other.getTotal_money()))
            && (this.getPaid_money() == null ? other.getPaid_money() == null : this.getPaid_money().equals(other.getPaid_money()))
            && (this.getProcess_fee() == null ? other.getProcess_fee() == null : this.getProcess_fee().equals(other.getProcess_fee()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getCustomer_id() == null) ? 0 : getCustomer_id().hashCode());
        result = prime * result + ((getCreate_time() == null) ? 0 : getCreate_time().hashCode());
        result = prime * result + ((getUpdate_time() == null) ? 0 : getUpdate_time().hashCode());
        result = prime * result + ((getIs_deleted() == null) ? 0 : getIs_deleted().hashCode());
        result = prime * result + ((getTime() == null) ? 0 : getTime().hashCode());
        result = prime * result + ((getNote() == null) ? 0 : getNote().hashCode());
        result = prime * result + ((getTotal_money() == null) ? 0 : getTotal_money().hashCode());
        result = prime * result + ((getPaid_money() == null) ? 0 : getPaid_money().hashCode());
        result = prime * result + ((getProcess_fee() == null) ? 0 : getProcess_fee().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", customer_id=").append(customer_id);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append(", is_deleted=").append(is_deleted);
        sb.append(", time=").append(time);
        sb.append(", note=").append(note);
        sb.append(", total_money=").append(total_money);
        sb.append(", paid_money=").append(paid_money);
        sb.append(", process_fee=").append(process_fee);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}