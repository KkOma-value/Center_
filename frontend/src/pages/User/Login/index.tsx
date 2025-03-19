import React, { useState } from 'react';
import { history, Link, useModel } from '@umijs/max';
import { Alert, Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Footer from '@/components/Footer';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
      return true;
    }
    return false;
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      console.log('Login request parameters:', {
        account: values.username,
        password: values.password,
      });
      
      // Call login API
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: values.username,
          password: values.password,
        }),
      });
      
      console.log('Login response status:', response.status, response.statusText);
      
      // Check response status
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response content:', responseText);
        
        if (responseText.includes('<!DOCTYPE')) {
          message.error(`Request failed: Server returned HTML page instead of JSON data. API path might be wrong or backend service is not running properly`);
        } else {
          message.error(`Request failed: ${response.status} ${response.statusText}`);
        }
        
        setUserLoginState({ status: 'error' });
        return;
      }
      
      // Try to parse JSON response
      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (responseText.trim() === '') {
          message.error('Server returned empty response');
          setUserLoginState({ status: 'error' });
          return;
        }
        
        data = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('JSON parsing error:', parseError);
        message.error(`Response data format error: ${parseError.message}`);
        setUserLoginState({ status: 'error' });
        return;
      }
      
      console.log('Login response data:', data);
      
      if (data && (data.id || data.userId)) {
        message.success('Login successful!');
        console.log('User role:', data.role);
        console.log('Complete user info:', data);
        
        // Ensure user info contains necessary fields
        const userInfo = {
          ...data,
          name: data.username || data.name,
          avatar: data.avatarUrl || data.avatar,
        };
        
        // Save user info to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('User info saved to localStorage:', userInfo);
        
        // Save user info to global state
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
        
        // Redirect all users to user management page
        console.log('Preparing to redirect to: /admin/user-management');
        try {
          window.location.href = '/admin/user-management';
        } catch (navError) {
          console.error('Navigation error:', navError);
          message.error('Page redirection failed, please refresh and try again');
        }
        return;
      }
      
      // Login failed
      setUserLoginState({ status: 'error' });
      message.error('Incorrect username or password!');
    } catch (error: any) {
      console.error('Login request exception:', error);
      message.error(`Login failed, please check your network connection: ${error.message}`);
      setUserLoginState({ status: 'error' });
    }
  };

  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h2 className={styles.headerTitle}>The kKoma</h2>
          
          {status === 'error' && (
            <LoginMessage content="账号或密码错误" />
          )}

          <Form form={form} onFinish={handleSubmit}>
            {/* 用户名 */}
            <Form.Item
              name="username"
              className={styles.inputItem}
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                size="large"
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            {/* 密码 */}
            <Form.Item
              name="password"
              className={styles.inputItem}
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password 
                size="large"
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <div className={styles.optionRow}>
              <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                <div className={styles.autoLogin}>
                  <input type="checkbox" id="autoLogin" />
                  <label htmlFor="autoLogin">自动登录</label>
                </div>
              </Form.Item>
              <div className={styles.optionLinks}>
                <Link to="/user/register" className={styles.optionLink}>
                  注册账号
                </Link>
                <Link to="/user/forgotPassword" className={styles.optionLink}>
                  忘记密码
                </Link>
              </div>
            </div>

            {/* 登录按钮 */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submitButton}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
