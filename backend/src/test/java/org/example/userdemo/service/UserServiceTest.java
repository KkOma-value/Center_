package org.example.userdemo.service;
import java.util.Date;

import jakarta.annotation.Resource;
import org.example.userdemo.model.domain.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/***
 * 用户服务测试
 *
 * @author kkoma
 */
@SpringBootTest
class UserServiceTest {


    @Resource
    private UserService userService;


    @Test
    void newadd(){
        String account = "kkoma";
        String password = "1234567";
        String checkpassword = "1234567";
        long result = userService.UserRegister(account, password, checkpassword);
        Assertions.assertTrue(result > 0);
    }

    @Test
    public void userAdd(){
        User user = new User();
        user.setUser_account("123");
        user.setUsername("kkoma");
        user.setGender(0);
        user.setAvatarUrl("D://图图//0af44d06d5b5bb816de8ac1940a855a.jpg");
        user.setUserPassword("123456");
        user.setEmail("123@qq.com");
        boolean result = userService.save(user);
        System.out.println(user.getId());
        Assertions.assertTrue(result);

    }
}