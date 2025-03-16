package org.example.userdemo.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.userdemo.model.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author 86187
* @description 针对表【user(用户)】的数据库操作Service
* @createDate 2025-01-18 00:56:42
*/
public interface UserService extends IService<User> {


    /**
     * 用户注释
     * @return
     */
    long UserRegister(String account, String password,String checkpassword);

    User UserLogin(String account, String password, HttpServletRequest request);

    User getSaveUser(User originUser);
}
