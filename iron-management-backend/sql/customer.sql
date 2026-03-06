create table customer
(
    id            bigint auto_increment
        primary key,
    customer_name varchar(256)  null,
    telephone     varchar(256)  null,
    address       varchar(256)  null,
    create_time   datetime      null,
    update_time   datetime      null,
    is_deleted    int default 0 null
)
    comment '下材料的客户';

