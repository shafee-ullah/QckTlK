import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import ReactPaginate from "react-paginate";
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
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 5;
  const [showNewPostsNotification, setShowNewPostsNotification] = useState(false);

  // Fetch posts with pagination
  const {
    data: postsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: [
      "posts",
      searchTerm,
      selectedTag,
      authorFilter,
      startDate,
      endDate,
      sortBy,
      currentPage,
    ],
    queryFn: async () => {
      const params = {
        search: searchTerm,
        tag: selectedTag,
        author: authorFilter,
        startDate: startDate,
        endDate: endDate,
        sort: sortBy === 'newest' ? 'new' : 'popular',
        page: currentPage + 1,
        limit: postsPerPage,
      };
      console.log('Fetching posts with params:', params);
      console.log('Sending request to /posts with params:', params);
      const response = await axiosSecure.get("/posts", { 
        params,
        paramsSerializer: params => {
          console.log('Serialized params:', new URLSearchParams(params).toString());
          return new URLSearchParams(params).toString();
        }
      });
      console.log('Received posts data:', {
        dataLength: response.data?.data?.length,
        firstPost: response.data?.data?.[0] ? {
          title: response.data.data[0].title,
          upVote: response.data.data[0].upVote,
          downVote: response.data.data[0].downVote,
          postTime: response.data.data[0].postTime
        } : null,
        sortParam: params.sort,
        currentPage: params.page,
        total: response.data?.total,
        totalPages: response.data?.totalPages,
      });
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const allPosts = React.useMemo(() => postsData?.data || [], [postsData]);
  const pageCount = React.useMemo(() => postsData?.totalPages || 0, [postsData]);
  
  // Debug logging
  useEffect(() => {
    if (postsData) {
      console.log('Pagination Debug:', {
        postsData: {
          data: postsData.data?.length,
          total: postsData.total,
          totalPages: postsData.totalPages,
          currentPage: postsData.currentPage,
          hasMore: postsData.hasMore,
        },
        sortBy,
        currentPage,
      });
      
      // Log the first post's vote info if available
      if (postsData.data?.length > 0) {
        const firstPost = postsData.data[0];
        console.log('First post info:', {
          title: firstPost.title,
          upVote: firstPost.upVote,
          downVote: firstPost.downVote,
          netVotes: (firstPost.upVote || 0) - (firstPost.downVote || 0),
          postTime: firstPost.postTime,
        });
      }
    }
  }, [postsData, currentPage, pageCount, allPosts, postsLoading]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }; 
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedTag, authorFilter, startDate, endDate, sortBy]);

  // Fetch popular tags
  const { data: popularTags = [] } = useQuery({
    queryKey: ['popularTags'],
    queryFn: async () => {
      const response = await axiosSecure.get('/api/tags/popular');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check for new posts periodically
  useEffect(() => {
    const checkForNewPosts = async () => {
      try {
        const response = await axiosSecure.get("/posts/count");
        const totalPosts = response.data?.total;
        
        if (typeof totalPosts === 'number' && postsData?.total && totalPosts > postsData.total) {
          setShowNewPostsNotification(true);
        }
      } catch (error) {
        console.error("Error checking for new posts:", error);
        // Don't show error to user, just log it
      }
    };

    // Only set up the interval if we have posts data
    if (postsData) {
      const interval = setInterval(checkForNewPosts, 30000);
      // Initial check
      checkForNewPosts();
      return () => clearInterval(interval);
    }
  }, [postsData, postsData?.total, axiosSecure]);

  // Fetch tags
  useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axiosSecure.get("/tags");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    console.log('Sort changed to:', newSort);
    console.log('Previous sort state:', sortBy);
    setSortBy(newSort);
    setCurrentPage(0); // Reset to first page when changing sort
    
    // Log the expected API request
    const params = {
      search: searchTerm,
      tag: selectedTag,
      author: authorFilter,
      startDate: startDate,
      endDate: endDate,
      sort: newSort === 'newest' ? 'new' : 'popular',
      page: 1, // Reset to first page
      limit: postsPerPage,
    };
    console.log('Expected API request with params:', params);
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
      <section className="relative text-white py-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <svg 
            className="w-full h-full object-cover"
            viewBox="0 0 1440 320" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill="#3b82f6" 
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="absolute inset-0 "></div>
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
                    className="w-full px-6 py-4 pl-12 text-gray-900  bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg"
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
                {popularTags.length > 0 ? (
                  popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagClick(tag.name)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800"
                      }`}
                      title={`${tag.count} posts`}
                    >
                      #{tag.name} <span className="text-xs opacity-75">{tag.count}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tags found</p>
                )}
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
                    allPosts.map((post) => (
                      <div
                        key={post._id}
    
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


                {/* Pagination */}
                {pageCount > 1 && (
                  <div className="flex justify-center mt-8">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={
                        <span className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Next</span>
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      }
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={pageCount}
                      previousLabel={
                        <span className="flex items-center justify-center px-3 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="w-5 h-5" />
                        </span>
                      }
                      renderOnZeroPageCount={null}
                      containerClassName="inline-flex items-center -space-x-px"
                      pageLinkClassName="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      activeLinkClassName="z-10 flex items-center justify-center px-3 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      breakClassName="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      disabledClassName="opacity-50 cursor-not-allowed"
                      forcePage={currentPage}
                    />
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
