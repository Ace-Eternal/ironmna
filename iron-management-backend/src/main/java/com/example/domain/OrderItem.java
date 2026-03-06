package com.example.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 单子上的每一块料
 * @TableName order_item
 */
@TableName(value ="order_item")
@Data
public class OrderItem implements Serializable {
    /**
     * 
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 材料类型方钢，圆钢
     */
    @TableField(value = "type")
    private String type;

    /**
     * 钢材型号 45# p20
     */
    @TableField(value = "steel_type")
    private String steel_type;

    /**
     * 长

     */
    @TableField(value = "length")
    private Double length;

    /**
     * 长度余量

     */
    @TableField(value = "length_remain")
    private Double length_remain;

    /**
     * 宽
     */
    @TableField(value = "width")
    private Double width;

    /**
     * 宽度余量

     */
    @TableField(value = "width_remain")
    private Double width_remain;

    /**
     * 厚度
     */
    @TableField(value = "thickness")
    private Double thickness;

    /**
     * 厚度余量
     */
    @TableField(value = "thickness_remain")
    private Double thickness_remain;

    /**
     * 件数
     */
    @TableField(value = "amount")
    private Integer amount;

    /**
     * 备注

     */
    @TableField(value = "note")
    private String note;

    /**
     * 单价

     */
    @TableField(value = "monovalent")
    private Double monovalent;

    /**
     * 总重量
     */
    @TableField(value = "total_weight")
    private Double total_weight;

    /**
     * 仅材料金额(不算加工费与刀费)
     */
    @TableField(value = "steel_money")
    private Double steel_money;

    /**
     * 刀费

     */
    @TableField(value = "cut_fee")
    private Double cut_fee;

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
     * 链接的订单编号
     */
    @TableField(value = "order_id")
    private Long order_id;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

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
        OrderItem other = (OrderItem) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getType() == null ? other.getType() == null : this.getType().equals(other.getType()))
            && (this.getSteel_type() == null ? other.getSteel_type() == null : this.getSteel_type().equals(other.getSteel_type()))
            && (this.getLength() == null ? other.getLength() == null : this.getLength().equals(other.getLength()))
            && (this.getLength_remain() == null ? other.getLength_remain() == null : this.getLength_remain().equals(other.getLength_remain()))
            && (this.getWidth() == null ? other.getWidth() == null : this.getWidth().equals(other.getWidth()))
            && (this.getWidth_remain() == null ? other.getWidth_remain() == null : this.getWidth_remain().equals(other.getWidth_remain()))
            && (this.getThickness() == null ? other.getThickness() == null : this.getThickness().equals(other.getThickness()))
            && (this.getThickness_remain() == null ? other.getThickness_remain() == null : this.getThickness_remain().equals(other.getThickness_remain()))
            && (this.getAmount() == null ? other.getAmount() == null : this.getAmount().equals(other.getAmount()))
            && (this.getNote() == null ? other.getNote() == null : this.getNote().equals(other.getNote()))
            && (this.getMonovalent() == null ? other.getMonovalent() == null : this.getMonovalent().equals(other.getMonovalent()))
            && (this.getTotal_weight() == null ? other.getTotal_weight() == null : this.getTotal_weight().equals(other.getTotal_weight()))
            && (this.getSteel_money() == null ? other.getSteel_money() == null : this.getSteel_money().equals(other.getSteel_money()))
            && (this.getCut_fee() == null ? other.getCut_fee() == null : this.getCut_fee().equals(other.getCut_fee()))
            && (this.getCreate_time() == null ? other.getCreate_time() == null : this.getCreate_time().equals(other.getCreate_time()))
            && (this.getUpdate_time() == null ? other.getUpdate_time() == null : this.getUpdate_time().equals(other.getUpdate_time()))
            && (this.getIs_deleted() == null ? other.getIs_deleted() == null : this.getIs_deleted().equals(other.getIs_deleted()))
            && (this.getOrder_id() == null ? other.getOrder_id() == null : this.getOrder_id().equals(other.getOrder_id()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getType() == null) ? 0 : getType().hashCode());
        result = prime * result + ((getSteel_type() == null) ? 0 : getSteel_type().hashCode());
        result = prime * result + ((getLength() == null) ? 0 : getLength().hashCode());
        result = prime * result + ((getLength_remain() == null) ? 0 : getLength_remain().hashCode());
        result = prime * result + ((getWidth() == null) ? 0 : getWidth().hashCode());
        result = prime * result + ((getWidth_remain() == null) ? 0 : getWidth_remain().hashCode());
        result = prime * result + ((getThickness() == null) ? 0 : getThickness().hashCode());
        result = prime * result + ((getThickness_remain() == null) ? 0 : getThickness_remain().hashCode());
        result = prime * result + ((getAmount() == null) ? 0 : getAmount().hashCode());
        result = prime * result + ((getNote() == null) ? 0 : getNote().hashCode());
        result = prime * result + ((getMonovalent() == null) ? 0 : getMonovalent().hashCode());
        result = prime * result + ((getTotal_weight() == null) ? 0 : getTotal_weight().hashCode());
        result = prime * result + ((getSteel_money() == null) ? 0 : getSteel_money().hashCode());
        result = prime * result + ((getCut_fee() == null) ? 0 : getCut_fee().hashCode());
        result = prime * result + ((getCreate_time() == null) ? 0 : getCreate_time().hashCode());
        result = prime * result + ((getUpdate_time() == null) ? 0 : getUpdate_time().hashCode());
        result = prime * result + ((getIs_deleted() == null) ? 0 : getIs_deleted().hashCode());
        result = prime * result + ((getOrder_id() == null) ? 0 : getOrder_id().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", type=").append(type);
        sb.append(", steel_type=").append(steel_type);
        sb.append(", length=").append(length);
        sb.append(", length_remain=").append(length_remain);
        sb.append(", width=").append(width);
        sb.append(", width_remain=").append(width_remain);
        sb.append(", thickness=").append(thickness);
        sb.append(", thickness_remain=").append(thickness_remain);
        sb.append(", amount=").append(amount);
        sb.append(", note=").append(note);
        sb.append(", monovalent=").append(monovalent);
        sb.append(", total_weight=").append(total_weight);
        sb.append(", steel_money=").append(steel_money);
        sb.append(", cut_fee=").append(cut_fee);
        sb.append(", create_time=").append(create_time);
        sb.append(", update_time=").append(update_time);
        sb.append(", is_deleted=").append(is_deleted);
        sb.append(", order_id=").append(order_id);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}