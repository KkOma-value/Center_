package org.example.userdemo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.example.userdemo.model.domain.User;
import org.example.userdemo.service.UserService;
import org.example.userdemo.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static contant.UserConstant.USER_LOGIN_STATE;

/**
* @author kkoma
* @description 针对表【user(用户)】的数据库操作Service实现
* @createDate 2025-01-18 00:56:42
*/
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

    @Resource
    private  UserMapper userMapper;


    //共用类抽出
    private static final String SALT = "KKOMA";


    /**
     * 用户登录键
     * 可以找到唯一的一个值
     */

    @Override
    public long UserRegister(String account, String password, String checkpassword) {

        //同时判断多个字符串
        if (StringUtils.isAnyBlank(account, password, checkpassword)) {
            return -1;
        }
        if (account.length() < 3){
            return -1;
        }
        if (password.length() < 6 || checkpassword.length() < 6){
            return -1;
        }

        String regEx="[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
        Pattern pattern = Pattern.compile(regEx);
        Matcher matcher = pattern.matcher(account);
        if (matcher.find()){
            return -1;
        }

        if (!password.equals(checkpassword)){
            return -1;
        }


        //column中的名字要与mysql中的列名一致
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_account", account);
        long count = this.count(queryWrapper);
        if (count > 0){
            return -1;
        }


        //加密
        String newPassword = DigestUtils.md5DigestAsHex((password + SALT).getBytes());


        //插入数据
        User user = new User();
        user.setUser_account(account);
        user.setUserPassword(newPassword);
        boolean save = this.save(user);
        if (!save) {
            return -1;
        }

        return user.getId();

    }


    @Override
    public User UserLogin(String account, String password, HttpServletRequest request) {
        if (StringUtils.isAnyBlank(account, password)) {
            return null;
        }
        if (account.length() < 3){
            return null;
        }
        if (password.length() < 6){
            return null;
        }

        String regEx="[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]";
        Pattern pattern = Pattern.compile(regEx);
        Matcher matcher = pattern.matcher(account);
        if (matcher.find()){
            return null;
        }


        //加密

        String newPassword = DigestUtils.md5DigestAsHex((password + SALT).getBytes());
        //查询用户是否存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_account", account);
        queryWrapper.eq("userPassword",newPassword);

        User user = userMapper.selectOne(queryWrapper);

        if (user == null){
            log.info("user login faild, account can't match password");
            return null;
        }
        //脱敏

        User safeUser = getSaveUser(user);
        //记录用户的登录态
        request.getSession().setAttribute(USER_LOGIN_STATE,safeUser);

        return safeUser;

    }


    /***
     * 用户脱敏
     * @param originUser
     * @return
     */
    @Override
    public User getSaveUser(User originUser){
        User safeUser = new User();
        safeUser.setId(originUser.getId());
        safeUser.setUser_account(originUser.getUser_account());
        safeUser.setUsername(originUser.getUsername());
        safeUser.setGender(originUser.getGender());
        safeUser.setAvatarUrl(originUser.getAvatarUrl());
        safeUser.setEmail(originUser.getEmail());
        safeUser.setRole(originUser.getRole());
        safeUser.setUserStatus(0);
        safeUser.setCreateTime(originUser.getCreateTime());

        return safeUser;

    }
}




