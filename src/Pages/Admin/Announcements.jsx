import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Modal, Form, Input, message, List, Tag, 
  Switch, Typography, Space, Divider, Tooltip, Badge, Avatar 
} from 'antd';
import { 
  PlusOutlined, BellOutlined, EditOutlined, 
  DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import useAxios from '../../../hooks/useAxios';
import './Announcements.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const axios = useAxios();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      message.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await axios.put(`/api/admin/announcements/${editingId}`, values);
        message.success('Announcement updated successfully');
      } else {
        await axios.post('/api/admin/announcements', values);
        message.success('Announcement created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      message.error('Failed to save announcement');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/admin/announcements/${id}/status`, { 
        isActive: !currentStatus 
      });
      message.success(`Announcement ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      message.error('Failed to update announcement status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/announcements/${id}`);
      message.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      message.error('Failed to delete announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    form.setFieldsValue({
      title: announcement.title,
      content: announcement.content,
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  return (
    <div className="admin-announcements">
      <Card 
        title={
          <div className="announcements-header">
            <Title level={4} style={{ margin: 0 }}>Announcements</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setModalVisible(true)}
            >
              New Announcement
            </Button>
          </div>
        }
        className="announcements-container"
        loading={loading}
      >
        <List
          itemLayout="vertical"
          dataSource={announcements}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              className="announcement-item"
              extra={
                <div className="announcement-actions">
                  <Space>
                    <Tooltip title={item.isActive ? 'Active' : 'Inactive'}>
                      <Switch 
                        checked={item.isActive} 
                        onChange={() => handleToggleStatus(item._id, item.isActive)}
                        checkedChildren={<CheckCircleOutlined />}
                        unCheckedChildren={<ClockCircleOutlined />}
                      />
                    </Tooltip>
                    <Button 
                      icon={<EditOutlined />} 
                      onClick={() => handleEdit(item)}
                    />
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(item._id)}
                    />
                  </Space>
                </div>
              }
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={item.isActive} color="green">
                    <Avatar 
                      icon={<BellOutlined />} 
                      style={{ backgroundColor: item.isActive ? '#52c41a' : '#d9d9d9' }} 
                    />
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color={item.isActive ? 'green' : 'default'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">
                      Posted by {item.author?.name || 'Admin'} • {moment(item.createdAt).fromNow()}
                    </Text>
                    <Text type="secondary">
                      {moment(item.updatedAt).isAfter(moment(item.createdAt).add(1, 'minute')) 
                        ? `Updated ${moment(item.updatedAt).fromNow()}` 
                        : ''}
                    </Text>
                  </Space>
                }
              />
              <div className="announcement-content">
                <Text>{item.content}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`${editingId ? 'Edit' : 'New'} Announcement`}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            loading={loading}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please enter a title' },
              { max: 100, message: 'Title must be less than 100 characters' },
            ]}
          >
            <Input placeholder="Enter announcement title" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: 'Please enter the announcement content' },
              { max: 1000, message: 'Content must be less than 1000 characters' },
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="Enter announcement content (supports markdown)" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Announcements;
