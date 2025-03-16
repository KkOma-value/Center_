package org.example.userdemo;

import ch.qos.logback.core.util.MD5Util;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.DigestUtils;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SpringBootTest
class UserDemoApplicationTests {


    @Test
    void mdtest() throws NoSuchAlgorithmException, UnsupportedEncodingException {
        String str = "123456";
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        String newpassword = DigestUtils.md5DigestAsHex(("abcd" + str).getBytes());
        System.out.println(newpassword);
    }
    @Test
    void contextLoads() {
    }

}
