package org.example.userdemo.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.example.userdemo.model.domain.User;
import org.example.userdemo.model.domain.request.UserLoginRequest;
import org.example.userdemo.model.domain.request.UserRegisterRequest;
import org.example.userdemo.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static contant.UserConstant.ADMIN_LOGIN_STATE;
import static contant.UserConstant.USER_LOGIN_STATE;

/**
 * 用户接口
 */

@RequestMapping("/user")
@RestController
//此注解下返回默认为JSON类型
public class UserController {

    //要引入Service层
    @Resource
    private UserService userService;

    @PostMapping("/register")
    public Long userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {

        if (userRegisterRequest == null){
            return null;
        }

        String account = userRegisterRequest.getAccount();
        String password = userRegisterRequest.getPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();

        if(StringUtils.isAnyBlank(account,password,checkPassword)){
            return null;
        }

        return userService.UserRegister(account, password, checkPassword);
    }

    @PostMapping("/login")
    public User userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {

        if (userLoginRequest == null){
            return null;
        }

        String account = userLoginRequest.getAccount();
        String password = userLoginRequest.getPassword();
        if(StringUtils.isAnyBlank(account,password)){
            return null;
        }

        return userService.UserLogin(account, password, request);
    }

    @GetMapping("/select")
    public List<User> select(String user_account,HttpServletRequest request) {

        if (!isAdmin(request)){
            return new ArrayList<>();
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(user_account)){
            queryWrapper.like("user_account",user_account);
        }
        List<User> users = userService.list(queryWrapper);
        return users.stream().map(user -> userService.getSaveUser(user)).collect(Collectors.toList());
    }


    @PostMapping("/delete")
    public boolean delete(@RequestBody long id,HttpServletRequest request) {
        if (!isAdmin(request)){
            return false;
        }

        if (id <= 0){
            return false;
        }
        return userService.removeById(id);
    }

    /***
     * 是否为管理员
     * @param request
     * @return
     */
    private boolean isAdmin(HttpServletRequest request) {


        Object admin = request.getSession().getAttribute(USER_LOGIN_STATE);

        User user = (User) admin;

        return user != null && user.getRole() == ADMIN_LOGIN_STATE;
    }
}
