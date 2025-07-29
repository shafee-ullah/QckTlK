import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, message, Card, Typography, Comment, Tooltip, Avatar } from 'antd';
import { CommentOutlined, DeleteOutlined, EyeOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import useAxios from '../../../hooks/useAxios';
import './Reports.css';

const { Title, Text } = Typography;

const Reports = () => {
  const [reportedComments, setReportedComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const axios = useAxios();

  const fetchReportedComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/reports/comments');
      setReportedComments(response.data);
    } catch (error) {
      console.error('Error fetching reported comments:', error);
      message.error('Failed to load reported comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const handleViewComment = (comment) => {
    setSelectedComment(comment);
    setCommentModalVisible(true);
  };

  const handleResolveReport = async (commentId, action) => {
    try {
      await axios.post(`/api/admin/reports/comments/${commentId}/action`, { action });
      message.success(`Report ${action === 'delete' ? 'resolved' : 'dismissed'}`);
      fetchReportedComments();
    } catch (error) {
      console.error(`Error handling report:`, error);
      message.error(`Failed to handle report`);
    }
  };

  const columns = [
    {
      title: 'Comment',
      dataIndex: 'content',
      render: (content, record) => (
        <div className="comment-preview">
          <div className="comment-author">
            <Avatar src={record.author?.photoURL} icon={<UserOutlined />} size="small" />
            <Text strong style={{ marginLeft: 8 }}>{record.author?.displayName || 'Anonymous'}</Text>
          </div>
          <Text ellipsis style={{ marginLeft: 32 }}>{content}</Text>
        </div>
      ),
    },
    {
      title: 'Reports',
      dataIndex: 'reports',
      width: 100,
      render: (reports) => (
        <Badge count={reports?.length || 0} style={{ backgroundColor: '#f5222d' }} />
      ),
    },
    {
      title: 'Actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewComment(record)} />
          <Button icon={<CloseCircleOutlined />} onClick={() => handleResolveReport(record._id, 'dismiss')} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleResolveReport(record._id, 'delete')} />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-reports">
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Reported Content</Title>
            <Button icon={<ReloadOutlined />} onClick={fetchReportedComments} loading={loading}>Refresh</Button>
          </div>
        }
        className="reports-container"
      >
        <Table
          columns={columns}
          dataSource={reportedComments}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Reported Comment"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCommentModalVisible(false)}>Close</Button>,
          <Button key="dismiss" onClick={() => handleResolveReport(selectedComment?._id, 'dismiss')}>Dismiss</Button>,
          <Button key="delete" type="primary" danger onClick={() => handleResolveReport(selectedComment?._id, 'delete')}>
            Delete Comment
          </Button>,
        ]}
      >
        {selectedComment && (
          <Comment
            author={selectedComment.author?.displayName || 'Anonymous'}
            avatar={<Avatar src={selectedComment.author?.photoURL} />}
            content={<p>{selectedComment.content}</p>}
            datetime={moment(selectedComment.createdAt).fromNow()}
          />
        )}
      </Modal>
    </div>
  );
};

export default Reports;
