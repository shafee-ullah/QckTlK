import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

// Import components
import DashboardLayout from '../../components/Dashboard/Layout/DashboardLayout';
import ProfileTab from '../../components/Dashboard/Tabs/ProfileTab';
import PostsTab from '../../components/Dashboard/Tabs/PostsTab';
import AddPostTab from '../../components/Dashboard/Tabs/AddPostTab';
import CommentsTab from '../../components/Dashboard/Tabs/CommentsTab';
import PaymentsTab from '../../components/Dashboard/Tabs/PaymentsTab';
import StatsTab from '../../components/Dashboard/Tabs/StatsTab';

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile and payments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileRes = await axiosSecure.get(`/api/users/profile?email=${user.email}`);
        const profileData = {
          ...profileRes.data,
          photoURL: user.photoURL || profileRes.data.photoURL,
        };
        setProfile(profileData);
        
        // Fetch payment history
        const paymentsRes = await axiosSecure.get('/api/payments/history');
        setPayments(paymentsRes.data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Set default profile if user doesn't exist
        if (err.response?.status === 404) {
          const defaultProfile = {
            email: user.email,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL || "/default-avatar.svg",
            membership: "free",
            badge: null,
            membershipUpgradedAt: null,
          };
          setProfile(defaultProfile);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, axiosSecure]);

  // Render the appropriate tab content
  const renderTabContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileTab profile={profile} />;
      case 'posts':
        return <PostsTab />;
      case 'add-post':
        return <AddPostTab />;
      case 'comments':
        return <CommentsTab />;
      case 'payments':
        return <PaymentsTab payments={payments} />;
      case 'stats':
        return <StatsTab />;
      default:
        return <ProfileTab profile={profile} />;
    }
  };

  return (
    <DashboardLayout user={user}>
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
