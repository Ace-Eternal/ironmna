package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.domain.Customer;
import com.example.service.CustomerService;
import com.example.mapper.CustomerMapper;
import org.springframework.stereotype.Service;

/**
* @author 洛畔
* @description 针对表【customer(下材料的客户)】的数据库操作Service实现
* @createDate 2025-07-13 20:46:10
*/
@Service
public class CustomerServiceImpl extends ServiceImpl<CustomerMapper, Customer>
    implements CustomerService{

}




