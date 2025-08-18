import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  User,
  FileText,
  Plus,
  MessageSquare,
  CreditCard,
  Settings,
  Home,
  BarChart3,
  Users,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await axiosSecure.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [axiosSecure]);

  // Fetch users when the users tab becomes active
  useEffect(() => {
    if (activeTab === 'users' && user?.email) {
      fetchAllUsers();
    }
  }, [activeTab, user?.email, fetchAllUsers]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(
          `/api/users/profile?email=${user.email}`
        );
        // Use Firebase user's photoURL if available, otherwise use the server data
        const profileData = {
          ...res.data,
          photoURL: user.photoURL || res.data.photoURL,
        };
        setProfile(profileData);
      } catch (err) {
        // If user doesn't exist, create a default profile
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
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(`/api/payments?email=${user.email}`);
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      }
    };

    if (user?.email) {
      fetchProfile();
      fetchPayments();
    }
  }, [user, axiosSecure]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <div className="text-xl font-semibold mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="text-xl font-semibold mb-2">No Profile Found</div>
          <div>Please contact support if this is an error.</div>
        </div>
      </div>
    );

  const tabs = [
    { id: "profile", name: "My Profile", icon: User },
    { id: "posts", name: "My Posts", icon: FileText },
    { id: "add-post", name: "Add Post", icon: Plus },
    { id: "comments", name: "Comments", icon: MessageSquare },
    { id: "payments", name: "Payments", icon: CreditCard },
    ...(profile?.role === 'admin' ? [
      { id: "users", name: "Manage Users", icon: Users },
      { id: "stats", name: "Statistics", icon: BarChart3 }
    ] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab profile={profile} />;
      case "posts":
        return <PostsTab />;
      case "add-post":
        return <AddPostTab />;
      case "comments":
        return <CommentsTab />;
      case "payments":
        return <PaymentsTab payments={payments} />;
      case "users":
        if (profile?.role !== 'admin') {
          // Redirect to profile if not admin
          setActiveTab('profile');
          return null;
        }
        return <UsersTab users={users} loading={loadingUsers} fetchUsers={fetchAllUsers} />;
      case "stats":
        if (profile?.role !== 'admin') {
          // Redirect to profile if not admin
          setActiveTab('profile');
          return null;
        }
        return <StatsTab />;
      default:
        return <ProfileTab profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link> */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg text-gray-500 dark:text-gray-200">
                Welcome back,{" "}
                {profile.displayName || profile.name || user.email}
              </div>
              {profile.badge === "Gold" && (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-400 text-white rounded-full text-sm font-bold">
                  Gold Member
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dashboard
                </h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab Components
const ProfileTab = ({ profile }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      My Profile
    </h3>
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <img
          src={profile.photoURL?.includes('googleusercontent.com') 
            ? profile.photoURL.replace('s96-c', 's192-c') 
            : profile.photoURL || "/default-avatar.svg"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.svg";
          }}
          referrerPolicy="no-referrer"
        />
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
            {profile.displayName || profile.name || "User"}
          </h4>
          <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            {profile.badge === "Gold" && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-400 text-white rounded-full text-sm font-bold shadow-sm">
                🏆 Gold Member
              </span>
            )}
            {profile.badge === "Bronze" && (
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full text-sm font-bold shadow-sm">
                🥉 Bronze Member
              </span>
            )}
            {!profile.badge && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                Free Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-orange-900/10 dark:to-orange-800/10 rounded-lg p-4 border border-green-200 dark:border-yellow-800 ">
          <div className="text-sm text-blue-600 dark:text-yellow-600 font-medium">
            Membership
          </div>
          <div className="text-lg font-bold text-blue-900 dark:text-yellow-600">
            {profile.membership || "Free"}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-sm text-green-700 dark:text-green-600 font-medium">
            Member Since
          </div>
          <div className="text-lg font-bold text-green-900 dark:text-green-500">
            {profile.membershipUpgradedAt
              ? new Date(profile.membershipUpgradedAt).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-sm text-purple-600 dark:text-purple-700 font-medium">
            Status
          </div>
          <div className="text-lg font-bold text-purple-900 dark:text-purple-500">
            Active
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profile Details
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <div className="text-gray-900 dark:text-white">
              {profile.displayName || profile.name || "Not set"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="text-gray-900 dark:text-white">{profile.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Badge
            </label>
            <div className="text-gray-900 dark:text-white">
              {profile.badge || "None"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Membership Type
            </label>
            <div className="text-gray-900 dark:text-white">
              {profile.membership || "Free"}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Edit Profile
        </button> */}
        {profile.badge !== "Gold" && (
          <Link to="/membership">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-white">
              Upgrade to Gold
            </button>
          </Link>
        )}
        {/* <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Change Password
        </button> */}
      </div>
    </div>
  </div>
);

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/posts", {
          params: {
            author: user.email,
            limit: 50, // Get more posts for the user
          },
        });
        setPosts(response.data.data || []);
      } catch {
        setError("Failed to load your posts");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMyPosts();
    }
  }, [user, axiosSecure]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axiosSecure.delete(`/posts/${postId}`, {
          data: { authorName: user.email }, // Send authorName in request body
        });
        setPosts(posts.filter((post) => post._id !== postId));
      } catch (error) {
        console.error("Delete post error:", error);
        alert("Failed to delete post");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Loading your posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Posts
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start sharing your thoughts with the community!
          </p>
          <Link
            to="/create-post"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Title
                </th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Tags
                </th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Created
                </th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Stats
                </th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {post.description.substring(0, 100)}
                        {post.description.length > 100 && "..."}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags &&
                        post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      {post.tags && post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.postTime)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-green-600 dark:text-green-400">
                          ↑ {post.upVote || 0}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          ↓ {post.downVote || 0}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          💬 {post.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/post/${post._id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AddPostTab = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        authorName: user.email, // Always use email for backend user lookup
        authorImage: user.photoURL || "/default-avatar.png",
        postTime: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/posts", postData);

      if (response.status === 201) {
        setSuccess("Post created successfully!");
        setFormData({ title: "", description: "", tags: "" });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          "You have reached your post limit. Upgrade to Gold membership for unlimited posts."
        );
      } else {
        setError("Failed to create post. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Add New Post
      </h3>

      {/* Post Limit Info */}
      <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-400 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-500">
              Post Limits
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-500">
              Free users: 5 posts • Gold members: Unlimited posts
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-300 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="text-green-800 dark:text-green-800">{success}</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="text-red-800 dark:text-red-200">{error}</div>
        </div>
      )}

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Post Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter your post title..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.title.length}/100 characters
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Post Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
            placeholder="Write your post content here..."
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.description.length}/1000 characters
          </div>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate tags with commas
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({ title: "", description: "", tags: "" })
            }
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Quick Actions */}
      {/* <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h4>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/create-post"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Full Create Post Page
          </Link>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            View My Posts
          </button>
        </div>
      </div> */}
    </div>
  );
};

const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        setLoading(true);
        // First get user's posts
        const postsResponse = await axiosSecure.get("/posts", {
          params: {
            author: user.email,
            limit: 50,
          },
        });

        const userPosts = postsResponse.data.data || [];
        const postIds = userPosts.map((post) => post._id);

        // Then get comments for those posts
        const allComments = [];
        for (const postId of postIds) {
          try {
            const commentsResponse = await axiosSecure.get(
              `/posts/${postId}/comments`
            );
            const postComments = commentsResponse.data.map((comment) => ({
              ...comment,
              postTitle:
                userPosts.find((post) => post._id === postId)?.title ||
                "Unknown Post",
            }));
            allComments.push(...postComments);
          } catch {
            // Skip if comments can't be fetched for a post
          }
        }

        setComments(allComments);
      } catch {
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserComments();
    }
  }, [user, axiosSecure]);

  const handleDeleteComment = async (commentId, postId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axiosSecure.delete(`/posts/${postId}/comments/${commentId}`, {
          data: { authorName: user.email },
        });
        setComments(comments.filter((comment) => comment._id !== commentId));
      } catch {
        alert("Failed to delete comment");
      }
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Loading comments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comment Management
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {comments.length} comment{comments.length !== 1 ? "s" : ""} on your
          posts
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No comments yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Comments on your posts will appear here for management.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={comment.authorImage || "/default-avatar.svg"}
                  alt={comment.authorName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.svg";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.authorName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleDeleteComment(comment._id, comment.postId)
                        }
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-700 dark:text-gray-300 mb-2">
                    {comment.comment}
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    On post:{" "}
                    <span className="font-medium">{comment.postTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Comment Management Tips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-600 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Comment Management Tips
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-100 space-y-1">
          <li>• You can delete any comment on your posts</li>
          <li>• Comments are automatically sorted by date</li>
          <li>• Deleted comments cannot be recovered</li>
        </ul>
      </div>
    </div>
  );
};

const PaymentsTab = ({ payments }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Payment History
    </h3>
    {payments.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No payment history found.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Date
              </th>
              <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
              <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.paymentIntentId}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  ${(payment.amount / 100).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const UsersTab = ({ users, loading, fetchUsers }) => {
  const updateUserRole = async (userId, newRole) => {
    try {
      // Ensure we're using the correct API URL based on the environment
      const apiUrl = import.meta.env.DEV 
        ? `https://qcktlk.vercel.app/api/users/${userId}/role`
        : `/api/users/${userId}/role`;
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If we can't parse the error as JSON, use the status text
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(errorData.error || 'Failed to update user role');
      }

      // Refresh the users list to show the updated role
      await fetchUsers();
      alert(`User role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(error.message || 'Failed to update user role. Please check the console for more details.');
    }
  };
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Users</h2>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Users'}
        </button>
      </div>
      
      {loading && users.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Member Since
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => {
                // Ensure we have a valid ID for the key
                const userId = user._id || user.id || Math.random().toString(36).substr(2, 9);
                const displayName = user.displayName || user.email?.split('@')[0] || 'User';
                const email = user.email || 'No email';
                // Handle different possible membership values (premium, gold, free, etc.)
                const membership = (user.membership || 'free').toLowerCase();
                const isPremium = membership === 'premium' || membership === 'gold';
                const photoURL = user.photoURL || '/default-avatar.svg';
                
                return (
                  <tr key={userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={photoURL} 
                            alt={displayName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-avatar.svg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {displayName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isPremium 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {isPremium ? 'Premium' : 'Free'}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {user.role || 'member'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => updateUserRole(user._id, 'admin')}
                          className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-600 text-blue-600 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] sm:max-w-none"
                          title="Make Admin"
                        >
                          <span className="hidden sm:inline">Make </span>Admin
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxios();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get('/api/statistics');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  const chartData = stats ? [
    { name: 'Posts', value: stats.posts, color: '#4f46e5' },
    { name: 'Comments', value: stats.comments, color: '#10b981' },
    { name: 'Users', value: stats.users, color: '#f59e0b' },
  ] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Site Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-600  p-6">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Posts</div>
          <div className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.posts.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-600 p-6">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Comments</div>
          <div className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
            {stats.comments.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-600 p-6">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</div>
          <div className="mt-1 text-3xl font-semibold text-yellow-600 dark:text-yellow-400">
            {stats.users.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-600 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribution:</h4>
        <div className="h-64 flex items-center justify-center">
          <PieChart width={400} height={250}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
