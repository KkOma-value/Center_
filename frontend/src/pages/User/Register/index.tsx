import React from 'react';
import { history, Link } from 'umi';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Footer from '@/components/Footer';
import styles from './index.less';

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      console.log('Registration request parameters:', {
        account: values.username,
        password: values.password,
        checkPassword: values.confirm,
      });
      
      // Call registration API
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: values.username,
          password: values.password,
          checkPassword: values.confirm,
        }),
      });
      
      console.log('Registration response status:', response.status, response.statusText);
      
      // Check response status
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response content:', responseText);
        
        if (responseText.includes('<!DOCTYPE')) {
          message.error(`Request failed: Server returned HTML page instead of JSON data. API path might be wrong or backend service is not running properly`);
        } else {
          message.error(`Request failed: ${response.status} ${response.statusText}`);
        }
        return;
      }
      
      // Try to parse JSON response
      let userId;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (responseText.trim() === '') {
          message.error('Server returned empty response');
          return;
        }
        
        userId = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('JSON parsing error:', parseError);
        message.error(`Response data format error: ${parseError.message}`);
        return;
      }
      
      console.log('Registration response data:', userId);
      
      if (userId && userId > 0) {
        message.success('Registration successful!');
        history.push('/user/login');
      } else if (userId === null) {
        message.error('Request parameters are empty!');
      } else if (userId === -1) {
        message.error('Username, password or confirm password is empty!');
      } else {
        message.error(`Registration failed, server returned: ${JSON.stringify(userId)}`);
      }
    } catch (error: any) {
      console.error('Registration request exception:', error);
      message.error(`Registration failed, please check your network connection: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h2 className={styles.headerTitle}>The kKoma</h2>
          
          <Form form={form} onFinish={onFinish} className={styles.registerForm}>
            {/* 用户名 */}
            <Form.Item
              name="username"
              className={styles.inputItem}
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '账号长度不能少于3个字符！' }
              ]}
            >
              <Input 
                size="large"
                prefix={<UserOutlined className={styles.prefixIcon} />}
                placeholder="用户名"
              />
            </Form.Item>

            {/* 密码 */}
            <Form.Item
              name="password"
              className={styles.inputItem}
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, message: '密码长度不能少于6个字符！' }
              ]}
            >
              <Input.Password 
                size="large"
                prefix={<LockOutlined className={styles.prefixIcon} />}
                placeholder="密码"
              />
            </Form.Item>

            {/* 确认密码 */}
            <Form.Item
              name="confirm"
              className={styles.inputItem}
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不匹配!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                size="large"
                prefix={<LockOutlined className={styles.prefixIcon} />}
                placeholder="确认密码"
              />
            </Form.Item>

            {/* 返回登录链接 */}
            <div className={styles.linkContainer}>
              <Link to="/user/login" className={styles.link}>
                返回登录
              </Link>
            </div>

            {/* 注册按钮 */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submitButton}>
                注册
              </Button>
            </Form.Item>
          </Form>

          {/* GitHub Link */}
          <div className={styles.otherLoginIcons}>
            <a
              className={styles.icon}
              href="https://github.com/KkOma-value/The_kkoma_center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/github.png" alt="github" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register; 