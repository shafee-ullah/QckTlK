import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, message, Popconfirm } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import useApi from '../../hooks/useApi';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await api.post(`/api/admin/make-admin/${userId}`);
      message.success('User role updated to admin');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Failed to update user role');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record) => (
        <div className="user-cell">
          {record.photoURL ? (
            <img 
              src={record.photoURL} 
              alt={record.displayName} 
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              <UserOutlined />
            </div>
          )}
          <span className="user-name">{record.displayName || 'Anonymous'}</span>
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
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role?.toUpperCase() || 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.role !== 'admin' && (
            <Popconfirm
              title="Are you sure you want to make this user an admin?"
              onConfirm={() => handleMakeAdmin(record.uid)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Make Admin</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <h2>Manage Users</h2>
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="uid"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="users-table"
      />
    </div>
  );
};

export default AdminUsers;
