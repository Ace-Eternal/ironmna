package com.example.admin.application;

import com.example.dto.AdminDTO;
import com.example.vo.AdminVO;

public interface AdminApplicationService {
    AdminDTO login(AdminVO adminVO);

    AdminDTO getUserInfo(String token);
}
