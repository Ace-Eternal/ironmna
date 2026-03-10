package com.example.controller;

import com.example.customer.application.CustomerApplicationService;
import com.example.domain.Customer;
import com.example.dto.ResponseWrapper;
import com.example.dto.Result;
import com.example.vo.UpdateCustomerVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/customer")
@RestController
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerApplicationService customerApplicationService;

    @GetMapping("/getCustomerList")
    public Result getCustomerList(@RequestParam Integer current, @RequestParam Integer pageSize) {
        var result = customerApplicationService.getCustomerList(current, pageSize);
        return result != null ? Result.ok("鑾峰彇瀹㈡埛鎴愬姛", result) : Result.fail("鑾峰彇瀹㈡埛澶辫触");
    }

    @GetMapping("/getCustomerNameList")
    public Result getCustomerNameList() {
        ResponseWrapper<Customer> response = customerApplicationService.getCustomerNameList();
        return Result.ok("鎴愬姛杩斿洖瀹㈡埛濮撳悕鍒楄〃", response);
    }

    @PostMapping("/addCustomer")
    public Result addCustomer(@RequestBody UpdateCustomerVO addCustomerVO) {
        Customer customer = customerApplicationService.addCustomer(addCustomerVO);
        return Result.ok("瀹㈡埛娣诲姞鎴愬姛", customer);
    }

    @PostMapping("/updateCustomer")
    public Result updateCustomer(@RequestBody UpdateCustomerVO updateCustomerVO) {
        boolean updated = customerApplicationService.updateCustomer(updateCustomerVO);
        return updated ? Result.ok("瀹㈡埛鏇存柊鎴愬姛", true) : Result.fail("瀹㈡埛鏇存柊澶辫触");
    }

    @PostMapping("/deleteCustomer")
    public Result deleteCustomer(@RequestParam Integer id) {
        boolean deleted = customerApplicationService.deleteCustomer(id);
        return deleted ? Result.ok("瀹㈡埛鍒犻櫎鎴愬姛", true) : Result.fail("瀹㈡埛鍒犻櫎澶辫触");
    }
}
