import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm } from 'antd';
import { 
  CommentOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons';
import useApi from '../../hooks/useApi';
import './AdminReports.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await api.delete(`/api/admin/reports/${reportId}`);
      message.success('Report resolved successfully');
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
      message.error('Failed to resolve report');
    }
  };

  const handleDeleteContent = async (report) => {
    try {
      // Delete the reported content
      if (report.contentType === 'comment') {
        await api.delete(`/api/comments/${report.contentId}`);
      } else {
        await api.delete(`/api/posts/${report.contentId}`);
      }
      
      // Also resolve the report
      await handleResolveReport(report._id);
      
      message.success('Content deleted and report resolved');
    } catch (error) {
      console.error('Error deleting content:', error);
      message.error('Failed to delete content');
    }
  };

  const columns = [
    {
      title: 'Reported Content',
      dataIndex: 'content',
      key: 'content',
      render: (_, record) => (
        <div className="report-content">
          <div className="report-header">
            <Tag color={record.contentType === 'comment' ? 'blue' : 'purple'}>
              {record.contentType?.toUpperCase()}
            </Tag>
            <span className="report-reason">
              <WarningOutlined /> {record.reason}
            </span>
          </div>
          <p className="report-text">
            {record.contentType === 'comment' 
              ? record.commentText 
              : record.postTitle}
          </p>
          <div className="report-meta">
            <span>Reported by: {record.reportedBy?.name || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(record.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => window.open(`/post/${record.postId}`, '_blank')}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this content?"
            onConfirm={() => handleDeleteContent(record)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <Button 
            type="link" 
            onClick={() => handleResolveReport(record._id)}
          >
            Resolve
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-reports">
      <div className="admin-reports-header">
        <h2>
          <CommentOutlined /> Reported Content
        </h2>
      </div>
      <Table 
        columns={columns} 
        dataSource={reports} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="reports-table"
      />
    </div>
  );
};

export default AdminReports;
