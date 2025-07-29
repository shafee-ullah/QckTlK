import React, { useState, useEffect } from 'react';

import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CommentOutlined } from '@ant-design/icons';
import useAxios from '../../hooks/useAxios';
import AdminLayout from '../../Layouts/AdminLayout';
import './AdminDashboard.css';

const { Title } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    activeUsers: 0
  });
  const axios = useAxios();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [axios]);



  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <Title level={3}>Dashboard Overview</Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Total Users" 
                value={stats.users} 
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Total Posts" 
                value={stats.posts} 
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Total Comments" 
                value={stats.comments} 
                prefix={<CommentOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Active Users" 
                value={stats.activeUsers} 
                prefix={<UserOutlined />}
                suffix={`/ ${stats.users}`}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
