package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.domain.Admin;
import com.example.service.AdminService;
import com.example.mapper.AdminMapper;
import org.springframework.stereotype.Service;

/**
* @author 洛畔
* @description 针对表【admin(管理员)】的数据库操作Service实现
* @createDate 2025-08-31 17:05:42
*/
@Service
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin>
    implements AdminService{

}




