package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private String type;
    private Integer code;
    private String message;
    private Object data;

    public static Result ok(){
        return new Result("success", 0, null, null);
    }
    public static Result ok(String message, Object data){
        return new Result("success", 0, message ,data);
    }
    public static Result fail(String errorMsg){
        return new Result("fail", 1 ,errorMsg, null);
    }
}
