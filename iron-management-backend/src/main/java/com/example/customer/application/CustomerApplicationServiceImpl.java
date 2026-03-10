package com.example.customer.application;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.common.exception.BusinessException;
import com.example.domain.Customer;
import com.example.dto.ResponseWrapper;
import com.example.service.CustomerService;
import com.example.util.NowDate;
import com.example.vo.UpdateCustomerVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerApplicationServiceImpl implements CustomerApplicationService {

    private final CustomerService customerService;

    @Override
    public IPage<Customer> getCustomerList(int current, int pageSize) {
        return customerService.page(new Page<>(current, pageSize));
    }

    @Override
    public ResponseWrapper<Customer> getCustomerNameList() {
        List<Customer> customerList = customerService.list();
        return new ResponseWrapper<>(customerList);
    }

    @Override
    public Customer addCustomer(UpdateCustomerVO addCustomerVO) {
        Customer customer = new Customer();
        customer.setCustomer_name(addCustomerVO.getCustomer_name());
        customer.setAddress(addCustomerVO.getAddress());
        customer.setTelephone(addCustomerVO.getTelephone());
        customer.setCreate_time(NowDate.getNowDate());
        boolean saved = customerService.save(customer);
        if (!saved) {
            throw new BusinessException("Failed to add customer");
        }
        return customer;
    }

    @Override
    public boolean updateCustomer(UpdateCustomerVO updateCustomerVO) {
        UpdateWrapper<Customer> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", updateCustomerVO.getId());

        Customer customer = new Customer();
        customer.setUpdate_time(NowDate.getNowDate());
        customer.setTelephone(updateCustomerVO.getTelephone());
        customer.setAddress(updateCustomerVO.getAddress());
        return customerService.update(customer, updateWrapper);
    }

    @Override
    public boolean deleteCustomer(Integer id) {
        return customerService.removeById(id);
    }
}
