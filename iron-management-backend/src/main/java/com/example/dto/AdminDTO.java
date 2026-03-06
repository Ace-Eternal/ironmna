package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private String UserId;
    private String username;
    private String realName;
    private String avatar;
    private String token;
    private String desc;
    private String homePath;
    private String password;
}
