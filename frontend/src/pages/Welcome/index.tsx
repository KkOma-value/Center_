import React from 'react';
import { Card, Typography, Button } from 'antd';
import { useModel, history } from '@umijs/max';
import styles from './index.less';

const { Title, Paragraph } = Typography;

// 扩展CurrentUser类型
interface CurrentUser {
  id?: number;
  user_account?: string;
  username?: string;
  role?: number;
  [key: string]: any;
}

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser as CurrentUser;

  const goToUserManagement = () => {
    if (currentUser?.role === 1) {
      history.push('/admin/user-management');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2}>欢迎使用用户中心系统</Title>
        <Paragraph>
          您好，{currentUser?.username || currentUser?.user_account || '用户'}！
        </Paragraph>
        
        {currentUser?.role === 1 && (
          <div className={styles.adminSection}>
            <Paragraph>
              您是管理员用户，可以访问用户管理功能。
            </Paragraph>
            <Button type="primary" onClick={goToUserManagement}>
              进入用户管理
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Welcome; 