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
  HelpCircle,
  Check,
  RotateCw,
  Clock,
  Video
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { votePost } from "../../services/post";

const Home = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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

  // Add this state for Q&A
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [activeResourceTab, setActiveResourceTab] = useState("articles");

  const resources = {
    articles: [
      {
        id: 1,
        title: 'Getting Started with React',
        description: 'Learn the basics of React and how to build your first app',
        author: 'John Richards',
        url: 'https://www.w3schools.com/react/react_getstarted.asp'
      },
      {
        id: 2,
        title: 'React Hooks Tutorial',
        description: 'Master the use of React Hooks to manage state and side effects',
        author: 'Jane Doe',
        url: 'https://www.w3schools.com/react/react_hooks.asp'
      },
      {
        id: 3,
        title: 'React Router Tutorial',
        description: 'Learn how to use React Router to manage client-side routing',
        author: 'Bob Smith',
        url: 'https://www.w3schools.com/react/react_router.asp'
      }
    ],
    tutorials: [
      {
        id: 1,
        title: 'React Crash Course',
        description: 'Learn React from scratch in this comprehensive tutorial',
        duration: '3 hours',
        level: 'Beginner',
        url: 'https://youtu.be/LDB4uaJ87e0?si=IAMFcD0zn-5dswEl'
      },
      {
        id: 2,
        title: 'React Advanced Tutorial',
        description: 'Take your React skills to the next level with this advanced tutorial',
        duration: '2 hours',
        level: 'Advanced',
        url: 'https://youtu.be/dCLhUialKPQ?si=5eqZ7MVEvtI_Gb9f'
      },
      {
        id: 3,
        title: 'React and Redux Tutorial',
        description: 'Learn how to use React and Redux together to build scalable apps',
        duration: '1 hour 37 minutes',
        level: 'Intermediate',
        url: 'https://youtu.be/qhll3DXuLHI?si=Ni4NAzO57ovtLoN7'
      }
    ],
    faqs: [
      {
        id: 1,
        question: 'What is React?',
        answer: 'React is a JavaScript library for building user interfaces.'
      },
      {
        id: 2,
        question: 'What is JSX?',
        answer: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
      },
      {
        id: 3,
        question: 'What is a React component?',
        answer: 'A React component is a small, reusable piece of code that represents a UI element.'
      }
    ]
  };

  const questions = [
    {
      question: 'What is the virtual DOM in React?',
      options: [
        'A copy of the real DOM',
        'A lightweight version of the browser DOM',
        'A React component',
        'A JavaScript framework'
      ],
      correct: 1,
      explanation: 'The virtual DOM is a lightweight copy of the actual DOM that React uses to optimize updates.'
    },
    {
      question: 'What does JSX stand for?',
      options: [
        'JavaScript XML',
        'JavaScript Extension',
        'JavaScript Syntax',
        'JavaScript XML Syntax'
      ],
      correct: 0,
      explanation: 'JSX stands for JavaScript XML. It allows us to write HTML in React.'
    },
    {
      question: 'What is the purpose of state in React?',
      options: [
        'To store component data',
        'To handle HTTP requests',
        'To style components',
        'To define component structure'
      ],
      correct: 0,
      explanation: 'State is used to store data that can change over time and affect what renders on the page.'
    }
  ];

  const handleOptionSelect = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
    const correct = index === questions[currentQuestionIndex].correct;
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setShowAnswer(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

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
      // console.log('Fetching posts with params:', params);
      // console.log('Sending request to /posts with params:', params);
      const response = await axiosSecure.get("/posts", { 
        params,
        paramsSerializer: params => {
          // console.log('Serialized params:', new URLSearchParams(params).toString());
          return new URLSearchParams(params).toString();
        }
      });
      // console.log('Received posts data:', {
      //   dataLength: response.data?.data?.length,
      //   firstPost: response.data?.data?.[0] ? {
      //     title: response.data.data[0].title,
      //     upVote: response.data.data[0].upVote,
      //     downVote: response.data.data[0].downVote,
      //     postTime: response.data.data[0].postTime
      //   } : null,
      //   sortParam: params.sort,
      //   currentPage: params.page,
      //   total: response.data?.total,
      //   totalPages: response.data?.totalPages,
      // });
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const allPosts = React.useMemo(() => postsData?.data || [], [postsData]);
  const pageCount = React.useMemo(() => postsData?.totalPages || 0, [postsData]);
  
  // Debug logging
  useEffect(() => {
    // if (postsData) {
    //   console.log('Pagination Debug:', {
    //     postsData: {
    //       data: postsData.data?.length,
    //       total: postsData.total,
    //       totalPages: postsData.totalPages,
    //       currentPage: postsData.currentPage,
    //       hasMore: postsData.hasMore,
    //     },
    //     sortBy,
    //     currentPage,
    //   });
      
    //   // Log the first post's vote info if available
    //   if (postsData.data?.length > 0) {
    //     const firstPost = postsData.data[0];
    //     console.log('First post info:', {
    //       title: firstPost.title,
    //       upVote: firstPost.upVote,
    //       downVote: firstPost.downVote,
    //       netVotes: (firstPost.upVote || 0) - (firstPost.downVote || 0),
    //       postTime: firstPost.postTime,
    //     });
    //   }
    // }
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
    // console.log('Sort changed to:', newSort);
    // console.log('Previous sort state:', sortBy);
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
    // console.log('Expected API request with params:', params);
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

  // Add events state
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'React 19 Deep Dive',
      date: '2025-08-25T15:00:00',
      description: 'Learn about the latest features in React 19',
      type: 'webinar',
      speaker: 'Dan Abramov'
    },
    {
      id: 2,
      title: 'State Management in 2025',
      description: 'Exploring modern state management solutions',
      type: 'workshop',
      speaker: 'Sarah Drasner'
    },
    {
      id: 3,
      title: 'Building Scalable Apps',
      date: '2025-09-22T16:00:00',
      description: 'Architecture patterns for large-scale applications',
      type: 'conference',
      speaker: 'Guillermo Rauch'
    }
  ]);

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ postId, voteType, userId }) => votePost(postId, voteType, userId),
    onMutate: async ({ postId, voteType }) => {
      await queryClient.cancelQueries(['posts', currentPage, searchTerm, selectedTag]);
      const previousPosts = queryClient.getQueryData(['posts', currentPage, searchTerm, selectedTag]);
      
      queryClient.setQueryData(['posts', currentPage, searchTerm, selectedTag], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(post => {
            if (post._id !== postId) return post;
            
            const newVotes = { ...(post.votes || {}) };
            const userVote = newVotes[user?.uid];
            let upVote = post.upVote || 0;
            let downVote = post.downVote || 0;
            
            // Remove previous vote if exists
            if (userVote) {
              if (userVote === 'upvote') upVote--;
              else downVote--;
            }
            
            // Add new vote if different from previous
            if (!userVote || userVote !== voteType) {
              newVotes[user?.uid] = voteType;
              if (voteType === 'upvote') upVote++;
              else downVote++;
            } else {
              // If clicking the same vote type, remove the vote
              delete newVotes[user?.uid];
            }
            
            return {
              ...post,
              upVote,
              downVote,
              votes: newVotes
            };
          })
        };
      });
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      console.error('Error voting:', err);
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', currentPage, searchTerm, selectedTag], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', currentPage, searchTerm, selectedTag] });
    },
  });
  
  const handleVote = (voteType, postId) => {
    if (!user) {
      // console.log('User not logged in');
      // Optionally show login prompt here
      return;
    }
    voteMutation.mutate({ 
      postId, 
      voteType,
      userId: user.uid
    });
  };

  // Countdown timer component
  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    function calculateTimeLeft() {
      const difference = new Date(targetDate) - new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return timeLeft;
    }

    const timerComponents = [];
    const timeUnits = [
      { label: 'Days', value: timeLeft.days },
      { label: 'Hours', value: timeLeft.hours },
      { label: 'Minutes', value: timeLeft.minutes },
      { label: 'Seconds', value: timeLeft.seconds }
    ];

    timeUnits.forEach((unit, index) => {
      if (!unit.value && unit.value !== 0) {
        return;
      }

      timerComponents.push(
        <div key={index} className="flex flex-col items-center mx-1">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {unit.label}
          </span>
        </div>
      );
    });

    return (
      <div className="flex justify-center space-x-2 mt-2 text-black dark:text-white">
        {timerComponents.length ? timerComponents : <span>Event started!</span>}
      </div>
    );
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 ">
              Welcome to QckTlk Forum
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Join the conversation, share your thoughts, and connect with our
              community
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="space-y-4">
                {/* Main Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts by title or content..."
                    className="w-full px-4 sm:px-6 py-3 pl-10 sm:pl-12 text-base text-gray-900 dark:text-white sm:text-lg bg-white dark:bg-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  />
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <button
                    type="submit"
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white dark:text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-colors"
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
      {/* {showNewPostsNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>New posts available! Refreshing...</span>
        </div>
      )} */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Sidebar - Existing content */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Tags Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagClick(tag.name)}
                      className={`px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
                        selectedTag === tag.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800"
                      } rounded-full`}
                      title={`${tag.count} posts`}
                    >
                      #{tag.name} <span className="opacity-75">{tag.count}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tags found</p>
                )}
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
                Test Your Knowledge
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {questions[currentQuestionIndex].question}
                </p>
                
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, index) => {
                    let optionClasses = "p-3 rounded-lg text-left w-full transition-colors ";
                    
                    if (showAnswer) {
                      if (index === questions[currentQuestionIndex].correct) {
                        optionClasses += "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
                      } else if (index === selectedOption && !isCorrect) {
                        optionClasses += "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
                      } else {
                        optionClasses += "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
                      }
                    } else {
                      optionClasses += "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300";
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={optionClasses}
                        disabled={showAnswer}
                      >
                        <div className="flex items-center">
                          {showAnswer && (
                            <span className="mr-2">
                              {index === questions[currentQuestionIndex].correct ? (
                                <Check className="w-4 h-4" />
                              ) : index === selectedOption ? (
                                <X className="w-4 h-4" />
                              ) : null}
                            </span>
                          )}
                          {option}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {showAnswer && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-600 rounded-lg text-blue-800 dark:text-blue-100">
                    <p className="font-medium">Explanation:</p>
                    <p>{questions[currentQuestionIndex].explanation}</p>
                    <button
                      onClick={nextQuestion}
                      className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-100 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Next Question <RotateCw className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Announcements Section */}
            {announcements.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-yellow-800 dark:text-yellow-200 flex items-center">
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
          <div className="lg:col-span-2">
            {/* Existing forum posts content */}
            {/* Sort Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Forum Posts
                </h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleSortChange("newest")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors ${
                      sortBy === "newest"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-1.5" />
                    Newest
                  </button>
                  <button
                    onClick={() => handleSortChange("popular")}
                    className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors ${
                      sortBy === "popular"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1.5" />
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          {/* Author Avatar */}
                          <img
                            src={post?.authorImage?.includes('googleusercontent.com')
                              ? post.authorImage.replace('s96-c', 's192-c')
                              : post?.authorImage || "/default-avatar.svg"}
                            alt={post.authorName}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-avatar.svg";
                            }}
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1">
                            {/* Post Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                                {post.authorName}
                              </h3>
                              <span className="hidden sm:inline text-gray-400">•</span>
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.postTime)}
                              </span>
                            </div>

                            {/* Post Title */}
                            <Link to={`/post/${post._id}`} className="block">
                              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                                {post.title}
                              </h2>
                            </Link>

                            {/* Post Stats */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-500 dark:text-gray-400 mt-3">
                              <div className="flex items-center gap-1 text-sm">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.commentCount || 0} comments</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVote('upvote', post._id);
                                    }}
                                    className={`p-2 rounded-lg transition-colors relative z-10 ${
                                      post?.votes?.[user?.uid] === 'upvote'
                                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-100'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    disabled={!user || voteMutation.isLoading}
                                    title={user ? 'Upvote' : 'Login to vote'}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  
                                  <span className="font-semibold text-gray-900 dark:text-white min-w-[1.5rem] text-center">
                                    {(post?.upVote || 0) - (post?.downVote || 0)}
                                  </span>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVote('downvote', post._id);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${
                                      post?.votes?.[user?.uid] === 'downvote'
                                        ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-100'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    disabled={!user || voteMutation.isLoading}
                                    title={user ? 'Downvote' : 'Login to vote'}
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                </div>
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

          {/* Right Sidebar - New Events Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" />
                Upcoming Events & Webinars
              </h3>
              
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id} 
                    className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-r transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-900/20 dark:bg-blue-300 p-2 rounded-lg mr-3">
                        <Video className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{event.speaker}</p>
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-600 mt-1">
                          <Clock className="w-3 h-3 mr-1 text-blue-600" />
                          {new Date(event.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <CountdownTimer targetDate={event.date} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
                    <Link 
                      to={`/events/${event.id}`}
                      className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-600 hover:underline"
                    >
                      See More <span className="ml-1">→</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                View All Events
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Resources Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Helpful Resources
              </h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveResourceTab("articles")}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeResourceTab === "articles"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  Articles
                </button>
                <button
                  onClick={() => setActiveResourceTab("tutorials")}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeResourceTab === "tutorials"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  Tutorials
                </button>
                <button
                  onClick={() => setActiveResourceTab("faqs")}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeResourceTab === "faqs"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  FAQs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeResourceTab === "articles" &&
                resources.articles.map((article) => (
                  <div key={article.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4  transition-shadow h-full flex flex-col bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 flex-grow">
                      {article.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-600">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        By {article.author}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-600 hover:underline text-sm whitespace-nowrap ml-2"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                ))}

              {activeResourceTab === "tutorials" &&
                resources.tutorials.map((tutorial) => (
                  <div key={tutorial.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tutorial.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 flex-grow">
                      {tutorial.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tutorial.duration} • {tutorial.level}
                      </span>
                      <a
                        href={tutorial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-600 hover:underline text-sm whitespace-nowrap ml-2"
                      >
                        Watch Now →
                      </a>
                    </div>
                  </div>
                ))}

              {activeResourceTab === "faqs" &&
                resources.faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
