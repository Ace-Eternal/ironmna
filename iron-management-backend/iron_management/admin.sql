create table admin
(
    id         bigint auto_increment
        primary key,
    admin_name varchar(256) null comment '管理员名称
',
    password   varchar(256) null comment '密码
',
    constraint admin_admin_name_uindex
        unique (admin_name)
)
    comment '管理员';

