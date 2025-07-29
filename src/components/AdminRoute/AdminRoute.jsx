import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // No need to check admin status here as it's handled in the AuthProvider
        if (!currentUser) {
          message.warning('Please log in to access this page');
        } else if (currentUser.role !== 'admin') {
          message.warning('You do not have permission to access this page');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        message.error('An error occurred while checking permissions');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, [currentUser]);

  if (loading || isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
