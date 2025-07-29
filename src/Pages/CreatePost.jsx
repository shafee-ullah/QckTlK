import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAxios from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";

const CreatePost = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    authorImage: user?.photoURL || "",
  });
  const [loading, setLoading] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkPostLimit = async () => {
      if (!user) {
        setIsCheckingLimit(false);
        return;
      }

      try {
        const response = await axiosSecure.get(`/posts/user/${user.email}/count`);
        setPostCount(response.data.count || 0);
        setHasReachedLimit(response.data.count >= 5 && user.membership !== 'premium');
      } catch (err) {
        console.error('Error checking post limit:', err);
        setError('Failed to check post limit. Please try again.');
      } finally {
        setIsCheckingLimit(false);
      }
    };

    checkPostLimit();
  }, [user, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!user) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }
    
    if (hasReachedLimit) {
      setError("You've reached the maximum number of posts for your account.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        title: form.title,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email,
        authorImage: form.authorImage,
      };
      await axiosSecure.post("/posts", payload);
      setSuccess("Post created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingLimit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Checking your post limit...</p>
        </div>
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Post Limit Reached
          </h2>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've used all <span className="font-bold">5/5</span> of your free posts.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-red-500 h-4 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posts used: 5/5 (100%)
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upgrade to a premium membership to post unlimited content and access exclusive features.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/membership')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full"
            >
              Upgrade to Premium
            </button>
            <button
              onClick={() => navigate('/dashboard/posts')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View Your Existing Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
      >
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create a New Post
            </h2>
            <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {postCount}/5 posts used
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Free Posts Remaining: {5 - postCount}</span>
              <span>{postCount * 20}% used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  postCount >= 4 ? 'bg-red-500' : 'bg-green-500'
                }`} 
                style={{ width: `${postCount * 20}%` }}
              ></div>
            </div>
            {postCount >= 3 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {postCount === 5 
                  ? 'You\'ve reached your limit!' 
                  : `Only ${5 - postCount} free post${5 - postCount === 1 ? '' : 's'} left!`}
              </p>
            )}
          </div>
        </div>
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. React, JavaScript, Frontend"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            name="authorImage"
            value={form.authorImage}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
