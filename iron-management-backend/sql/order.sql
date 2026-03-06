create table `order`
(
    id          bigint auto_increment
        primary key,
    customer_id int          null comment '外键 是哪一个客户的单子
',
    create_time datetime     null,
    update_time datetime     null,
    is_deleted  int          null,
    time        datetime     null comment '写在单子上的日期
',
    note        varchar(256) null comment '备注
',
    total_money float        null comment '写下单子最下面的总金额
',
    paid_money  float        null comment '已经支付的金额
',
    process_fee float        null comment '加工费
'
)
    comment '下的每一副材料';

