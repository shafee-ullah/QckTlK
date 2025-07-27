import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Search, TrendingUp, Calendar, MessageCircle, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import useAxios from '../../hooks/useAxios';

const Home = () => {
    const axiosSecure = useAxios();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'popular'
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // Fetch posts
    const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = useQuery({
        queryKey: ['posts', searchTerm, selectedTag, sortBy, currentPage],
        queryFn: async () => {
            const response = await axiosSecure.get('/posts', {
                params: {
                    search: searchTerm,
                    tag: selectedTag,
                    sort: sortBy,
                    page: currentPage,
                    limit: postsPerPage
                }
            });
            return response.data;
        }
    });

    // Fetch tags
    const { data: tags = [] } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await axiosSecure.get('/tags');
            return response.data;
        }
    });

    // Fetch announcements
    const { data: announcements = [] } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const response = await axiosSecure.get('/announcements');
            return response.data;
        }
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        refetchPosts();
    };

    const handleTagClick = (tagName) => {
        setSelectedTag(tagName === selectedTag ? '' : tagName);
        setCurrentPage(1);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalPages = Math.ceil((posts.total || 0) / postsPerPage);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Banner Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Welcome to QckTlk Forum
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Join the conversation, share your thoughts, and connect with our community
                        </p>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search posts by tags..."
                                    className="w-full px-6 py-4 pl-12 text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Tags Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Popular Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag._id}
                                        onClick={() => handleTagClick(tag.name)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            selectedTag === tag.name
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Announcements Section */}
                        {announcements.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center">
                                    <Bell className="w-5 h-5 mr-2" />
                                    Announcements ({announcements.length})
                                </h3>
                                <div className="space-y-3">
                                    {announcements.slice(0, 3).map((announcement) => (
                                        <div key={announcement._id} className="border-l-4 border-yellow-400 pl-3">
                                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                                {announcement.title}
                                            </h4>
                                            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                                                {announcement.description.substring(0, 100)}...
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        
                        {/* Sort Controls */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    Forum Posts
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSortChange('newest')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            sortBy === 'newest'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Newest
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('popular')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            sortBy === 'popular'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <TrendingUp className="w-4 h-4 inline mr-1" />
                                        Popular
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Posts Loading State */}
                        {postsLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-800 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-300 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                                                <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Posts List */}
                                <div className="space-y-6">
                                    {posts.data && posts.data.length > 0 ? (
                                        posts.data.map((post) => (
                                            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                                                <div className="flex items-start space-x-4">
                                                    
                                                    {/* Author Avatar */}
                                                    <img
                                                        src={post.authorImage || '/default-avatar.png'}
                                                        alt={post.authorName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    
                                                    <div className="flex-1">
                                                        {/* Post Header */}
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                                {post.authorName}
                                                            </h3>
                                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                                {formatDate(post.postTime)}
                                                            </span>
                                                        </div>
                                                        
                                                                                            {/* Post Title */}
                                    <Link to={`/post/${post._id}`}>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                                            {post.title}
                                        </h2>
                                    </Link>
                                                        
                                                        {/* Post Tags */}
                                                        <div className="flex flex-wrap gap-1 mb-4">
                                                            {post.tags && post.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        
                                                        {/* Post Stats */}
                                                        <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                                                            <div className="flex items-center gap-1">
                                                                <MessageCircle className="w-4 h-4" />
                                                                <span className="text-sm">{post.commentCount || 0} comments</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                                                    <span className="text-sm">{post.upVote || 0}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                                                    <span className="text-sm">{post.downVote || 0}</span>
                                                                </div>
                                                                <span className="text-sm font-medium">
                                                                    Net: {(post.upVote || 0) - (post.downVote || 0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-gray-500 dark:text-gray-400 text-lg">
                                                {searchTerm || selectedTag ? 'No posts found matching your search.' : 'No posts available yet.'}
                                            </div>
                                            {(searchTerm || selectedTag) && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setSelectedTag('');
                                                    }}
                                                    className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-4 py-2 rounded-lg font-medium ${
                                                            currentPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;