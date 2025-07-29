import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Modal, 
  message, 
  Space, 
  Popconfirm,
  Tag,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import  useApi  from '../../hooks/useApi';
import './AdminAnnouncements.css';

const { TextArea } = Input;

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const api = useApi();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      message.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await api.put(`/api/announcements/${editingId}`, values);
        message.success('Announcement updated successfully');
      } else {
        await api.post('/api/announcements', values);
        message.success('Announcement created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAnnouncements();
      setEditingId(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
      message.error('Failed to save announcement');
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      priority: record.priority || 'normal',
    });
    setEditingId(record._id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/announcements/${id}`);
      message.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      message.error('Failed to delete announcement');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="announcement-title">
          <span className="announcement-text">{text}</span>
          {record.priority === 'high' && (
            <Tag color="red" style={{ marginLeft: 8 }}>High Priority</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <div className="announcement-content">
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this announcement?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-announcements">
      <div className="admin-announcements-header">
        <h2>
          <NotificationOutlined /> Announcements
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditingId(null);
            setModalVisible(true);
          }}
        >
          New Announcement
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={announcements} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="announcements-table"
      />

      <Modal
        title={`${editingId ? 'Edit' : 'Create New'} Announcement`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ priority: 'normal' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter announcement title" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter the announcement content' }]}
          >
            <TextArea rows={4} placeholder="Enter announcement content" />
          </Form.Item>
          
          <Form.Item
            name="priority"
            label="Priority"
          >
            <Input type="hidden" />
          </Form.Item>
          
          <Divider />
          
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingId(null);
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncements;
