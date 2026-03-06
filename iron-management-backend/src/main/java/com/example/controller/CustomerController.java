package com.example.controller;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.domain.Customer;
import com.example.domain.Order;
import com.example.dto.ResponseWrapper;
import com.example.dto.Result;
import com.example.vo.PageVO;
import com.example.service.CustomerService;
import com.example.util.NowDate;
import com.example.vo.UpdateCustomerVO;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/customer")
@RestController
@CrossOrigin("*")
public class CustomerController {

    @Resource
    CustomerService customerService;

    /**
     * 分页获取所有的客户
     * 可以自动过滤被逻辑删除的记录
     * @return
     */
    @GetMapping("/getCustomerList")
    public Result getCustomerList(@RequestParam Integer current, @RequestParam Integer pageSize) {
        // 构造 Page 对象（自动分页）
        Page<Customer> page = new Page<>(current, pageSize);

        // 执行分页查询，自动过滤逻辑删除的记录
        IPage<Customer> result = customerService.page(page);

        return result != null ? Result.ok("获取客户成功", result) : Result.fail("获取客户失败");

    }

    @GetMapping("/getCustomerNameList")
    public Result getCustomerNameList(){
        // 1. 查询原始数据（仍然是 List<Customer>）
        List<Customer> customerList = customerService.list();

        // 2. 包装成 ResponseWrapper
        ResponseWrapper<Customer> response = new ResponseWrapper<>(customerList);

        // 3. 返回结果（Result.ok 会自动转成 JSON）
        return Result.ok("成功返回客户姓名列表", response);
    }

    /**
     * 添加一个客户
     * @return
     */
    @PostMapping("/addCustomer")
    public Result addCustomer(@RequestBody UpdateCustomerVO addCustomerVO){
        Customer customer = new Customer();
        customer.setCustomer_name(addCustomerVO.getCustomer_name());
        customer.setAddress(addCustomerVO.getAddress());
        customer.setTelephone(addCustomerVO.getTelephone());
        customer.setCreate_time(NowDate.getNowDate());
        boolean b = customerService.save(customer);
        return b ? Result.ok("客户添加成功", customer) : Result.fail("客户添加失败");
    }

    @PostMapping("/updateCustomer")
    public Result updateCustomer(@RequestBody UpdateCustomerVO updateCustomerVO){
        UpdateWrapper<Customer> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", updateCustomerVO.getId());
        Customer customer = new Customer();
        customer.setUpdate_time(NowDate.getNowDate());
        customer.setTelephone(updateCustomerVO.getTelephone());
        customer.setAddress(updateCustomerVO.getAddress());
        boolean b = customerService.update(customer, updateWrapper);
        return b ? Result.ok("客户更新成功", b) : Result.fail("客户更新失败");
    }

    /*
     * 删除客户
     */
    @PostMapping("/deleteCustomer")
    public Result deleteCustomer(@RequestParam Integer id){
        boolean b = customerService.removeById(id);
        return b ? Result.ok("客户删除成功", b) : Result.fail("客户删除失败");
    }





}
