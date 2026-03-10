package com.example.controller;

import com.example.common.file.GeneratedFile;
import com.example.domain.Order;
import com.example.dto.PageResult;
import com.example.dto.Result;
import com.example.order.application.OrderApplicationService;
import com.example.vo.OrderVO;
import com.example.vo.UpdateOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/order")
@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderApplicationService orderApplicationService;

    @GetMapping("/getOrderList")
    public Result getList(@RequestParam Integer current, @RequestParam Integer pageSize) {
        PageResult pageResult = orderApplicationService.getOrderList(current, pageSize);
        return pageResult != null ? Result.ok("鑾峰彇璐﹀崟鎴愬姛", pageResult) : Result.fail("鑾峰彇璐﹀崟澶辫触");
    }

    @GetMapping("/getOrderDetail")
    public Result getOrderDetail(@RequestParam Integer id) {
        Order order = orderApplicationService.getOrderDetail(id);
        return Result.ok("鑾峰彇璁㈠崟璇︽儏鎴愬姛", order);
    }

    @PostMapping("/createOrder")
    public Result createOrder(@RequestBody OrderVO orderVO) {
        Order order = orderApplicationService.createOrder(orderVO);
        return Result.ok("鍒涘缓璁㈠崟鎴愬姛", order);
    }

    @PostMapping("/deleteOrder")
    public Result deleteOrder(@RequestParam Integer orderId) {
        boolean deleted = orderApplicationService.deleteOrder(orderId);
        return deleted ? Result.ok("鍒犻櫎璁㈠崟鎴愬姛", true) : Result.fail("鍒犻櫎璁㈠崟澶辫触");
    }

    @PostMapping("/updateOrder")
    public Result updateOrder(@RequestBody UpdateOrderVO updateOrderVO) {
        boolean updated = orderApplicationService.updateOrder(updateOrderVO);
        return updated ? Result.ok("璁㈠崟鏇存柊鎴愬姛", true) : Result.fail("璁㈠崟鏇存柊澶辫触");
    }

    @PostMapping("/exportOrder")
    public Result exportOrder(@RequestParam Integer id) {
        String fileName = orderApplicationService.exportOrderDocument(id);
        return Result.ok("鏂囨。鐢熸垚鎴愬姛", fileName);
    }

    @GetMapping("/download")
    public ResponseEntity<Object> downloadFile(@RequestParam String file) {
        GeneratedFile generatedFile = orderApplicationService.downloadGeneratedFile(file);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + generatedFile.fileName());
        headers.add(HttpHeaders.CONTENT_TYPE,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        return ResponseEntity.status(HttpStatus.OK)
                .headers(headers)
                .contentLength(generatedFile.contentLength())
                .body(generatedFile.resource());
    }
}
