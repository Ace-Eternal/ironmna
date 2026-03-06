package com.example.vo;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class PageVO<T> extends Page<T> {  // 继承 MyBatis-Plus 的 Page
    private Integer current;
    private Integer pageSize;

    @Override
    public long getCurrent() {  // 适配 getter/setter 方法
        return this.current == null ? 1L : this.current;
    }

    @Override
    public long getSize() {
        return this.pageSize == null ? 10L : this.pageSize;
    }
}
