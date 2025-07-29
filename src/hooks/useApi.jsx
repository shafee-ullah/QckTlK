import { useState, useCallback } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext/index.jsx';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add auth token if user is logged in
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const config = {
        ...options,
        headers,
      };

      const response = await fetch(`/api${url}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return { data };
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An error occurred');
      message.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const get = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((url, body, options = {}) => {
    return request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [request]);

  const put = useCallback((url, body, options = {}) => {
    return request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [request]);

  const del = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'DELETE' });
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};

export default useApi;
