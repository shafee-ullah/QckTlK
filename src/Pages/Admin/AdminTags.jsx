import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Tag, 
  Space, 
  message, 
  Popconfirm,
  Tooltip,
  Modal,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TagOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import useApi  from '../../hooks/useApi';
import './AdminTags.css';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const api = useApi();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (values) => {
    try {
      if (editingTag) {
        await api.put(`/api/tags/${editingTag._id}`, values);
        message.success('Tag updated successfully');
      } else {
        await api.post('/api/tags', values);
        message.success('Tag created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      message.error(error.response?.data?.message || 'Failed to save tag');
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/api/tags/${tagId}`);
      message.success('Tag deleted successfully');
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      message.error('Failed to delete tag');
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      description: tag.description || '',
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="tag-name-cell">
          <Tag color={record.color || '#1890ff'}>
            {text}
          </Tag>
          {record.isFeatured && (
            <Tooltip title="Featured Tag">
              <Tag color="gold" style={{ marginLeft: 8 }}>
                <CheckOutlined /> Featured
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || 'No description',
    },
    {
      title: 'Usage Count',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      align: 'center',
      render: (count) => count || 0,
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
            title="Edit tag"
          />
          <Popconfirm
            title="Are you sure you want to delete this tag?"
            onConfirm={() => handleDeleteTag(record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="Delete tag"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-tags">
      <div className="admin-tags-header">
        <h2>
          <TagOutlined /> Manage Tags
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditingTag(null);
            setIsModalVisible(true);
          }}
        >
          Add New Tag
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={tags} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="tags-table"
      />

      <Modal
        title={`${editingTag ? 'Edit' : 'Add New'} Tag`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingTag(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTag}
          initialValues={{
            name: '',
            description: '',
            isFeatured: false
          }}
        >
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[
              { required: true, message: 'Please enter a tag name' },
              { min: 2, message: 'Tag name must be at least 2 characters' },
              { max: 20, message: 'Tag name cannot exceed 20 characters' }
            ]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description (Optional)"
            rules={[
              { max: 100, message: 'Description cannot exceed 100 characters' }
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter tag description" />
          </Form.Item>
          
          <div className="form-actions">
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingTag(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ marginLeft: 8 }}
            >
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTags;
