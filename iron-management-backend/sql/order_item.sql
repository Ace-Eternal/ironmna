create table order_item
(
    id               bigint auto_increment
        primary key,
    type             varchar(256)  null comment '材料类型方钢，圆钢',
    steel_type       varchar(256)  null comment '钢材型号 45# p20',
    length           float         null comment '长
',
    length_remain    float         null comment '长度余量
',
    width            float         null comment '宽',
    width_remain     float         null comment '宽度余量
',
    thickness        float         null comment '厚度',
    thickness_remain float         null comment '厚度余量',
    amount           int           null comment '件数',
    note             varchar(256)  null comment '备注
',
    monovalent       float         null comment '单价
',
    total_weight     float         null comment '总重量',
    steel_money      float         null comment '仅材料金额(不算加工费与刀费)',
    cut_fee          float         null comment '刀费
',
    create_time      datetime      null,
    update_time      datetime      null,
    is_deleted       int default 0 null,
    order_id         int           null comment '链接的订单编号'
)
    comment '单子上的每一块料';

