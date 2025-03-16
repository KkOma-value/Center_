package org.example.userdemo.model.domain.request;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户注册请求体
 */

//Serializable 序列化接口的实现
@Data
public class UserRegisterRequest implements Serializable {

    private static final long serialVersionUID = -5230936930830267559L;

    private String account;

    private String password;

    private String checkPassword;
}

