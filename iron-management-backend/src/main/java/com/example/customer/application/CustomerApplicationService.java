package com.example.customer.application;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.domain.Customer;
import com.example.dto.ResponseWrapper;
import com.example.vo.UpdateCustomerVO;

public interface CustomerApplicationService {
    IPage<Customer> getCustomerList(int current, int pageSize);

    ResponseWrapper<Customer> getCustomerNameList();

    Customer addCustomer(UpdateCustomerVO addCustomerVO);

    boolean updateCustomer(UpdateCustomerVO updateCustomerVO);

    boolean deleteCustomer(Integer id);
}
