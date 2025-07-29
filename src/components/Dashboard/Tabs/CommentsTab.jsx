import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, User } from 'lucide-react';
import useAxios from '../../../hooks/useAxios';
import { Link } from 'react-router';

export const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosSecure.get('/api/comments/my-comments');
        setComments(response.data);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [axiosSecure]);

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axiosSecure.delete(`/api/comments/${commentId}`);
        setComments(comments.filter(comment => comment._id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment');
      }
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Comments</h2>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't made any comments yet. Start participating in discussions!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {comments.map((comment) => (
              <div key={comment._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {comment.author?.photoURL ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={comment.author.photoURL}
                            alt={comment.author.displayName}
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author?.displayName || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                    <Link
                      to={`/posts/${comment.post?._id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View post: {comment.post?.title || 'Post not found'}
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete comment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsTab;
