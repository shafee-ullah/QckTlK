import React from 'react';
import { Outlet } from 'react-router';
import { Layout, Menu, theme } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  CommentOutlined, 
  BellOutlined, 
  TagOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext/index.jsx';
import './AdminLayout.css';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/reports',
      icon: <CommentOutlined />,
      label: 'Reports',
    },
    {
      key: '/admin/announcements',
      icon: <BellOutlined />,
      label: 'Announcements',
    },
    {
      key: '/admin/tags',
      icon: <TagOutlined />,
      label: 'Tags',
    },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
        <div className="admin-logout" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
