import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, Input, Button, Space, Tag, Popconfirm, message, 
  Tooltip, Avatar, Typography, Select, Badge, Card, Row, Col 
} from 'antd';
import { 
  SearchOutlined, ReloadOutlined, UserOutlined, 
  CrownOutlined, UserSwitchOutlined, UserDeleteOutlined 
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import useAxios from '../../../hooks/useAxios';
import './Users.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const axios = useAxios();

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const { current, pageSize, sortField, sortOrder } = {
        ...pagination,
        ...params.pagination,
      };

      const queryParams = {
        page: current,
        limit: pageSize,
        search: searchText || undefined,
        sortField: sortField || undefined,
        sortOrder: sortOrder || undefined,
      };

      const response = await axios.get('/api/admin/users', { params: queryParams });
      
      setUsers(response.data.users);
      setPagination({
        ...pagination,
        ...params.pagination,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      message.success(`User role updated to ${newRole}`);
      fetchUsers({ pagination });
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Failed to update user role');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'User',
      dataIndex: 'displayName',
      key: 'name',
      fixed: 'left',
      width: 220,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar 
            src={record.photoURL} 
            icon={!record.photoURL && <UserOutlined />} 
            style={{ backgroundColor: record.role === 'admin' ? '#f56a00' : '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text || 'Anonymous'}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
      ...getColumnSearchProps('displayName'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Member', value: 'member' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag 
          color={role === 'admin' ? 'gold' : 'blue'} 
          style={{ textTransform: 'capitalize' }}
        >
          {role === 'admin' ? <CrownOutlined style={{ marginRight: 4 }} /> : null}
          {role || 'member'}
        </Tag>
      ),
    },
    {
      title: 'Membership',
      dataIndex: 'membership',
      key: 'membership',
      width: 150,
      filters: [
        { text: 'Free', value: 'free' },
        { text: 'Premium', value: 'premium' },
      ],
      onFilter: (value, record) => record.membership === value,
      render: (membership) => (
        <Badge 
          status={membership === 'premium' ? 'success' : 'default'}
          text={membership === 'premium' ? 'Premium' : 'Free'}
        />
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {record.role !== 'admin' ? (
            <Popconfirm
              title="Make this user an admin?"
              onConfirm={() => handleRoleChange(record._id, 'admin')}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Make Admin">
                <Button 
                  type="text" 
                  icon={<UserSwitchOutlined style={{ color: '#52c41a' }} />} 
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Remove admin privileges?"
              onConfirm={() => handleRoleChange(record._id, 'member')}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Remove Admin">
                <Button 
                  type="text" 
                  danger 
                  icon={<UserDeleteOutlined />} 
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-users">
      <Card 
        title={
          <Title level={4} style={{ margin: 0 }}>
            User Management
          </Title>
        }
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchUsers({ pagination })}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        }
        className="users-container"
      >
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={users}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          rowClassName={(record) => record.role === 'admin' ? 'admin-row' : ''}
        />
      </Card>
    </div>
  );
};

export default Users;
