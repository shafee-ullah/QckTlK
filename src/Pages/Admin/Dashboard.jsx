import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from 'antd';
import { 
  UserOutlined, FileOutlined, CommentOutlined, 
  ArrowUpOutlined, ArrowDownOutlined, TeamOutlined 
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import useAxios from '../../../hooks/useAxios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/users?limit=5&sort=recent')
        ]);
        
        setStats(statsRes.data.stats);
        setRecentUsers(usersRes.data.users);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axios]);

  const pieData = [
    { type: 'Posts', value: stats?.posts || 0 },
    { type: 'Comments', value: stats?.comments || 0 },
    { type: 'Users', value: stats?.users || 0 },
  ];

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'displayName',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img 
            src={record.photoURL || '/default-avatar.png'} 
            alt={text} 
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          <span>{text || 'Anonymous'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role?.toUpperCase() || 'MEMBER'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.membership === 'premium' ? 'green' : 'default'}>
          {record.membership?.toUpperCase() || 'FREE'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.users || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<Tag color="green" style={{ marginLeft: 8 }}>+12% <ArrowUpOutlined /></Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Posts"
              value={stats?.posts || 0}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Comments"
              value={stats?.comments || 0}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Users">
            <Table 
              columns={columns} 
              dataSource={recentUsers} 
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Statistics">
            <div style={{ height: 300 }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="Quick Actions"
            className="quick-actions"
          >
            <div className="action-buttons">
              <div className="action-button">
                <TeamOutlined className="action-icon" />
                <span>Manage Users</span>
              </div>
              <div className="action-button">
                <CommentOutlined className="action-icon" />
                <span>View Reports</span>
              </div>
              <div className="action-button">
                <FileOutlined className="action-icon" />
                <span>Create Post</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
