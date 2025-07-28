import React, { useState, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  Search,
  TrendingUp,
  Calendar,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Filter,
  X,
  RefreshCw,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";

const Home = () => {
  const axiosSecure = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // 'newest' or 'popular'
  const [showNewPostsNotification, setShowNewPostsNotification] =
    useState(false);
  const [lastPostCount, setLastPostCount] = useState(0);
  const postsPerPage = 5;
  const observerRef = useRef();

  // Fetch posts with infinite scroll
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: [
      "posts",
      searchTerm,
      selectedTag,
      authorFilter,
      startDate,
      endDate,
      sortBy,
    ],
    queryFn: async ({ pageParam = null }) => {
      const response = await axiosSecure.get("/posts", {
        params: {
          search: searchTerm,
          tag: selectedTag,
          author: authorFilter,
          startDate: startDate,
          endDate: endDate,
          sort: sortBy,
          limit: postsPerPage,
          lastId: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastId : undefined,
    initialPageParam: null,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
  });

  // Flatten all posts from all pages
  const allPosts = postsData?.pages.flatMap((page) => page.data) || [];

  // Check for new posts
  useEffect(() => {
    if (allPosts.length > lastPostCount && lastPostCount > 0) {
      setShowNewPostsNotification(true);
      setTimeout(() => setShowNewPostsNotification(false), 5000);
    }
    setLastPostCount(allPosts.length);
  }, [allPosts.length, lastPostCount]);

  // Intersection observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (postsLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [postsLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axiosSecure.get("/tags");
      return response.data;
    },
  });

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await axiosSecure.get("/announcements");
      return response.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetchPosts();
  };

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName === selectedTag ? "" : tagName);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setAuthorFilter("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    searchTerm || selectedTag || authorFilter || startDate || endDate;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              Join the conversation, share your thoughts, and connect with our
              community
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {/* Main Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts by title or content..."
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

                {/* Advanced Filters Toggle */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Author Filter */}
                      <div className="relative">
                        <input
                          type="text"
                          value={authorFilter}
                          onChange={(e) => setAuthorFilter(e.target.value)}
                          placeholder="Filter by author..."
                          className="w-full px-4 py-3 pl-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      </div>

                      {/* Start Date */}
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-3 pl-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      </div>

                      {/* End Date */}
                      <div className="relative">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-3 pl-10 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Clear All
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Real-time Notification */}
      {showNewPostsNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>New posts available! Refreshing...</span>
        </div>
      )}

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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800"
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
                    <div
                      key={announcement._id}
                      className="border-l-4 border-yellow-400 pl-3"
                    >
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
                    onClick={() => handleSortChange("newest")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === "newest"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Newest
                  </button>
                  <button
                    onClick={() => handleSortChange("popular")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === "popular"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
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
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
                  >
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
                  {allPosts.length > 0 ? (
                    allPosts.map((post, index) => (
                      <div
                        key={post._id}
                        ref={index === allPosts.length - 1 ? lastPostRef : null}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Author Avatar */}
                          <img
                            src={post.authorImage || "/default-avatar.png"}
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

                            {/* Post Title with Hover Preview */}
                            <div className="relative group">
                              <Link to={`/post/${post._id}`}>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                                  {post.title}
                                </h2>
                              </Link>

                              {/* Hover Preview */}
                              {post.description && (
                                <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                  <div className="text-sm font-medium mb-2">
                                    {post.title}
                                  </div>
                                  <div className="text-xs text-gray-300 line-clamp-3">
                                    {post.description.length > 150
                                      ? `${post.description.substring(
                                          0,
                                          150
                                        )}...`
                                      : post.description}
                                  </div>
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </div>

                            {/* Post Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags &&
                                post.tags.map((tag, index) => (
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
                                <span className="text-sm">
                                  {post.commentCount || 0} comments
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <ArrowUp className="w-4 h-4 text-green-500" />
                                  <span className="text-sm">
                                    {post.upVote || 0}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ArrowDown className="w-4 h-4 text-red-500" />
                                  <span className="text-sm">
                                    {post.downVote || 0}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  Net:{" "}
                                  {(post.upVote || 0) - (post.downVote || 0)}
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
                        {hasActiveFilters
                          ? "No posts found matching your search."
                          : "No posts available yet."}
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Loading indicator for infinite scroll */}
                {isFetchingNextPage && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading more posts...
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {/* Removed pagination controls as infinite scroll is implemented */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
