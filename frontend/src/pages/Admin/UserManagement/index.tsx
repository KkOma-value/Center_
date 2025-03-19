import React, { useEffect, useState, useRef } from 'react';
import { 
  Button, 
  Input, 
  Table, 
  Space, 
  Popconfirm, 
  message, 
  Card, 
  Tag, 
  Avatar, 
  Tooltip, 
  Badge, 
  Dropdown, 
  Menu,
  Modal,
  Form,
  Select,
  Divider,
  Row,
  Col,
  Statistic,
  FloatButton,
  Layout
} from 'antd';
import { 
  SearchOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  UserOutlined, 
  ReloadOutlined, 
  DownloadOutlined,
  FilterOutlined,
  EyeOutlined,
  PlusOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useModel, history } from '@umijs/max';
import styles from './index.less';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';

type UserType = {
  id: number;
  user_account: string;
  username: string;
  gender: number;
  email: string;
  phone: string;
  userStatus?: number;
  user_status?: number;
  role?: number;
  userRole?: number;
  createTime?: string;
  create_time?: string;
  updateTime?: string;
  update_time?: string;
  lastLoginTime?: string;
  last_login_time?: string;
  avatar_url?: string;
  avatarUrl?: string;
  user_name?: string;
  userAccount?: string;
  account?: string;
  accountName?: string;
  name?: string;
  userName?: string;
  login?: string;
  faker?: string;
};

// 扩展CurrentUser类型
interface CurrentUser {
  id?: number;
  role?: number;
  [key: string]: any;
}

type DataIndex = keyof UserType;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();
  const searchInput = useRef<InputRef>(null);
  const { initialState } = useModel('@@initialState');
  const currentLoginUser = initialState?.currentUser as CurrentUser;
  const [userStats, setUserStats] = useState({
    total: 0,
    admin: 0,
    normal: 0,
    active: 0,
  });

  // 检查是否已登录
  useEffect(() => {
    if (!currentLoginUser || !currentLoginUser.id) {
      message.error('请先登录');
      history.push('/user/login');
      return;
    }
    
    console.log('当前登录用户信息:', currentLoginUser);
    
    // 添加一个短暂的延迟，确保组件完全挂载
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // 计算用户统计信息
  useEffect(() => {
    if (users.length > 0) {
      console.log('计算用户统计信息，用户数据:', users);
      const stats = {
        total: users.length,
        admin: users.filter(user => user.role === 1 || user.userRole === 1).length,
        normal: users.filter(user => user.role === 0 || (user.userRole !== undefined && user.userRole === 0)).length,
        active: users.filter(user => user.userStatus === 0 || user.user_status === 0).length,
      };
      console.log('计算得到的统计信息:', stats);
      setUserStats(stats);
    } else {
      // 如果没有用户数据，设置所有统计为0
      setUserStats({
        total: 0,
        admin: 0,
        normal: 0,
        active: 0,
      });
    }
  }, [users]);

  // 获取用户列表
  const fetchUsers = async (account?: string) => {
    setLoading(true);
    try {
      console.log('获取用户列表，当前用户:', currentLoginUser);
      
      // 构建 API URL
      let url = '/api/user/select';
      if (account) {
        url += `?user_account=${account}`;
      }
      
      // 调用后端 API 获取数据
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 cookies
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      
      // 获取响应文本并解析为 JSON
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON解析失败:', e);
        throw new Error('响应内容解析失败');
      }
      
      console.log('获取到的用户数据:', data);
      
      // 处理返回的数据
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (data.code === 0 && data.data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.error('返回的数据格式不正确:', data);
        throw new Error('返回的数据格式不正确');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败，请刷新页面重试');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 单个删除用户
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确定要删除该用户吗？',
      icon: <ExclamationCircleOutlined />,
      content: '此操作不可逆，请谨慎操作',
      okText: '确定',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch('/api/user/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(id), // 直接将ID作为请求体发送
            credentials: 'include', // 确保发送 cookies
          });
          
          if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('删除用户响应:', result);
          
          // 根据后端返回的布尔值判断
          if (result === true || result.code === 0) {
            message.success('用户删除成功');
            fetchUsers(searchValue);
          } else {
            message.error('删除失败: ' + (result.message || '未知错误'));
          }
        } catch (error) {
          console.error('删除用户失败:', error);
          message.error(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },
    });
  };
  
  // 批量删除用户
  const handleBatchDelete = async () => {
    // 创建选择用户的弹窗
    const selectedUsers = users.filter(user => selectedRowKeys.includes(user.id));
    
    Modal.confirm({
      title: '批量删除用户',
      width: 600,
      content: (
        <div>
          <div style={{ marginBottom: 16 }}>
            已选择 {selectedUsers.length} 个用户，请确认要删除以下用户：
          </div>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {selectedUsers.map(user => (
              <div key={user.id} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                <Space>
                  <Avatar 
                    size="small" 
                    src={user.avatarUrl || user.avatar_url}
                    icon={<UserOutlined />}
                  />
                  <span>{user.username}</span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>({user.user_account})</span>
                  {(user.role === 1 || user.userRole === 1) && (
                    <Tag color="gold" style={{ marginLeft: 8 }}>管理员</Tag>
                  )}
                </Space>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, color: '#ff4d4f' }}>
            注意：此操作不可逆，删除后数据将无法恢复！
          </div>
        </div>
      ),
      okText: '确认删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          // 直接发送ID列表，不需要包装在对象中
          const idList = selectedRowKeys.map(id => Number(id));
          
          console.log('批量删除请求数据:', idList);
          
          const response = await fetch('/api/user/deleteBatch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(idList),
            credentials: 'include', // 确保发送 cookies
          });
          
          if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('批量删除响应:', result);
          
          // 根据后端返回的布尔值判断
          if (result === true || result.code === 0) {
            message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
            setSelectedRowKeys([]);
            fetchUsers(searchValue);
          } else {
            message.error('批量删除失败: 权限不足或操作异常');
          }
        } catch (error) {
          console.error('批量删除失败:', error);
          message.error(`批量删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },
    });
  };

  // 搜索用户
  const handleSearch = () => {
    fetchUsers(searchValue);
  };

  // 重置筛选和排序
  const handleReset = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchValue('');
    fetchUsers();
  };

  // 打开编辑模态框
  const showEditModal = (record: UserType) => {
    setCurrentUser(record);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      gender: record.gender,
      role: record.role,
      userStatus: record.userStatus,
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  // 提交编辑表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!currentUser) {
        message.error('未找到要编辑的用户');
        return;
      }
      
      // 构建更新用户的请求体，与后端接口保持一致
      const updateData = {
        id: currentUser.id,
        username: values.username,
        email: values.email,
        gender: values.gender,
        userStatus: values.userStatus,
        role: values.role,
      };
      
      console.log('尝试更新用户，数据:', updateData);
      
      // 调用更新用户API
      let response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include', // 确保发送cookies
      });
      
      // 如果原始路径失败，尝试使用其他可能的路径
      if (!response.ok && response.status === 404) {
        console.log('原始路径404，尝试替代路径...');
        
        // 尝试第一个替代路径
        response = await fetch('/api/updateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
          credentials: 'include', 
        });
        
        // 如果第一个替代路径也失败，尝试第二个替代路径
        if (!response.ok && response.status === 404) {
          console.log('第一个替代路径404，尝试第二个替代路径...');
          response = await fetch('/api/user', {
            method: 'PUT', // 使用PUT方法，符合RESTful风格
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include', 
          });
          
          // 如果第二个替代路径也失败，尝试第三个替代路径
          if (!response.ok && response.status === 404) {
            console.log('第二个替代路径404，尝试第三个替代路径...');
            response = await fetch('/api/user/modify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updateData),
              credentials: 'include', 
            });
          }
        }
      }
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('更新用户响应:', result);
      
      if (result === true || (result && result.code === 0)) {
        message.success('用户信息更新成功');
        setIsModalVisible(false);
        fetchUsers(searchValue);
      } else {
        message.error('更新失败: ' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      message.error(`更新失败: ${error instanceof Error ? error.message : '表单验证失败'}`);
    }
  };

  // 表格列搜索处理函数
  const handleTableSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchValue(selectedKeys[0]);
  };

  // 表格列搜索重置函数
  const handleTableReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchValue('');
  };

  // 获取表格列搜索组件
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<UserType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleTableSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleTableSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleTableReset(clearFilters!)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const val = value.toString();
      const fieldValue = record[dataIndex];
      return fieldValue
        ? fieldValue.toString().toLowerCase().includes(val.toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          const input = document.querySelector('.ant-table-filter-dropdown input') as HTMLInputElement;
          if (input) {
            input.focus();
          }
        }, 100);
      }
    },
  });

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
      width: 80,
    },
    {
      title: '用户信息',
      dataIndex: 'username',
      key: 'userInfo',
      width: 220,
      ellipsis: true,
      render: (_, record) => {
        // 获取用户账号，尝试多种可能的字段名
        const accountValue = record.user_account || record.userAccount || record.account || record.login || String(record.id) || '-';
        // 检查是否从后端接收到了账号字段
        const isAccountMissing = !record.user_account && !record.userAccount && !record.account && !record.login;
        
        return (
          <div className={styles.userInfo}>
            <Avatar
              size={40}
              shape="circle"
              src={record.avatarUrl || record.avatar_url}
              icon={<UserOutlined />}
              className={styles.userAvatar}
            />
            <div className={styles.userMeta}>
              <div className={styles.userName}>
                {record.username}
                {record.faker && <Tag color="purple" style={{ marginLeft: 8 }}>测试</Tag>}
              </div>
              <div className={styles.userAccount}>
                账号: {accountValue}
                {isAccountMissing && <span style={{ color: '#ff4d4f' }}> (获取失败)</span>}
              </div>
            </div>
          </div>
        );
      },
      ...getColumnSearchProps('username'),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 220,
      render: (_, record) => (
        <div className={styles.contactInfo}>
          <div>
            <span className={styles.contactLabel}>邮箱:</span> {record.email || '-'}
          </div>
        </div>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      filters: [
        { text: '未知', value: 0 },
        { text: '男', value: 1 },
        { text: '女', value: 2 },
      ],
      filteredValue: filteredInfo.gender || null,
      onFilter: (value, record) => record.gender === value,
      render: (gender: number) => {
        let text = '未知';
        let color = 'default';
        
        if (gender === 1) {
          text = '男';
          color = 'blue';
        } else if (gender === 2) {
          text = '女';
          color = 'pink';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      key: 'userStatus',
      width: 100,
      filters: [
        { text: '正常', value: 0 },
        { text: '异常', value: 1 },
      ],
      filteredValue: filteredInfo.userStatus || null,
      onFilter: (value, record) => {
        const status = record.userStatus !== undefined ? record.userStatus : record.user_status;
        return status === value;
      },
      render: (status: number, record: UserType) => {
        const userStatus = status !== undefined ? status : record.user_status;
        return userStatus === 0 ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="error" text="异常" />
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      filters: [
        { text: '管理员', value: 1 },
        { text: '普通用户', value: 0 },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => {
        const role = record.role !== undefined ? record.role : record.userRole;
        return role === value;
      },
      render: (role: number, record: UserType) => {
        const userRole = role !== undefined ? role : record.userRole;
        return userRole === 1 ? (
          <Tag color="gold">管理员</Tag>
        ) : (
          <Tag color="green">普通用户</Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => {
        const timeA = a.createTime || a.create_time || '';
        const timeB = b.createTime || b.create_time || '';
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      },
      sortOrder: sortedInfo.columnKey === 'createTime' ? sortedInfo.order : null,
      render: (time: string, record: UserType) => {
        const createTime = time || record.create_time;
        if (!createTime) return '-';
        const date = new Date(createTime);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
    {
      title: '最近登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      width: 180,
      sorter: (a, b) => {
        const timeA = a.lastLoginTime || a.last_login_time || 0;
        const timeB = b.lastLoginTime || b.last_login_time || 0;
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      },
      sortOrder: sortedInfo.columnKey === 'lastLoginTime' ? sortedInfo.order : null,
      render: (time: string, record: UserType) => {
        const lastLoginTime = time || record.last_login_time;
        if (!lastLoginTime) return '-';
        const date = new Date(lastLoginTime);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              className={styles.actionButton}
            />
          </Tooltip>
          {/* 只有管理员可以编辑 */}
          {currentLoginUser?.role === 1 && (
            <Tooltip title="编辑">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                className={styles.actionButton}
                onClick={() => showEditModal(record)}
              />
            </Tooltip>
          )}
          {/* 只有管理员可以删除 */}
          {currentLoginUser?.role === 1 && (
            <Tooltip title="删除">
              <Popconfirm
                title="确定要删除此用户吗？"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  className={styles.actionButton}
                  disabled={record.role === 1 && currentLoginUser?.id === record.id}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 表格变化处理
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: UserType) => ({
      disabled: record.role === 1 && currentLoginUser?.id === record.id,
    }),
  };

  // 导出用户数据为CSV
  const exportToCSV = (data: UserType[], filename: string) => {
    // 定义CSV表头
    const headers = [
      'ID',
      '用户账号',
      '用户名',
      '性别',
      '邮箱',
      '状态',
      '角色',
      '创建时间',
      '最近登录'
    ];
    
    // 将用户数据转换为CSV行
    const rows = data.map(user => [
      user.id,
      user.user_account,
      user.username,
      user.gender === 0 ? '男' : user.gender === 1 ? '女' : '未知',
      user.email || '',
      (user.userStatus === 0 || user.user_status === 0) ? '正常' : '异常',
      (user.role === 1 || user.userRole === 1) ? '管理员' : '普通用户',
      user.createTime || user.create_time || '',
      user.lastLoginTime || user.last_login_time || ''
    ]);
    
    // 组合表头和数据行
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 导出所有用户数据
  const handleExportAll = () => {
    exportToCSV(users, `用户数据_全部_${new Date().toISOString().slice(0, 10)}.csv`);
    message.success('导出成功');
  };
  
  // 导出选中的用户数据
  const handleExportSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的用户');
      return;
    }
    
    const selectedUsers = users.filter(user => selectedRowKeys.includes(user.id));
    exportToCSV(selectedUsers, `用户数据_选中_${new Date().toISOString().slice(0, 10)}.csv`);
    message.success('导出成功');
  };

  // 导出菜单项
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'exportAll',
      label: '导出所有用户',
      onClick: handleExportAll
    },
    {
      key: 'exportSelected',
      label: '导出选中用户',
      disabled: selectedRowKeys.length === 0,
      onClick: handleExportSelected
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statistics}>
        <Row gutter={16}>
          <Col span={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title="总用户数"
                value={userStats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title="管理员"
                value={userStats.admin}
                prefix={<UserSwitchOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title="普通用户"
                value={userStats.normal}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statsCard}>
              <Statistic
                title="活跃用户"
                value={userStats.active}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      
      <Card className={styles.tableCard}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h2>用户管理</h2>
            <Tag color="blue">{users.length} 个用户</Tag>
          </div>
          <div className={styles.actions}>
            <Space size="middle">
              <Input
                placeholder="搜索用户账号"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                className={styles.searchInput}
              />
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleSearch}
              >
                搜索
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置
              </Button>
              {/* 只有管理员可以导出 */}
              {currentLoginUser?.role === 1 && (
                <Dropdown
                  menu={{
                    items: exportMenuItems
                  }}
                >
                  <Button icon={<DownloadOutlined />}>
                    导出
                  </Button>
                </Dropdown>
              )}
              {/* 只有管理员可以批量删除 */}
              {currentLoginUser?.role === 1 && (
                <Button 
                  type="primary" 
                  danger 
                  icon={<DeleteOutlined />} 
                  disabled={selectedRowKeys.length === 0}
                  onClick={handleBatchDelete}
                >
                  批量删除
                </Button>
              )}
            </Space>
          </div>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          rowSelection={currentLoginUser?.role === 1 ? rowSelection : undefined}
          className={styles.table}
          scroll={{ x: 1300 }}
          locale={{
            emptyText: '暂无数据'
          }}
        />
      </Card>
      
      <Modal
        title="编辑用户信息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
          initialValues={{ gender: 0, userStatus: 0, role: 0 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="gender"
            label="性别"
          >
            <Select>
              <Select.Option value={0}>未知</Select.Option>
              <Select.Option value={1}>男</Select.Option>
              <Select.Option value={2}>女</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="userStatus"
            label="状态"
          >
            <Select>
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>禁用</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
          >
            <Select>
              <Select.Option value={0}>普通用户</Select.Option>
              <Select.Option value={1}>管理员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 