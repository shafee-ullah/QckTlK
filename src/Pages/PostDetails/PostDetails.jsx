import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const PostDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const openCommentModal = (comment) => {
    setSelectedComment(comment);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedComment(null);
  };

  // Fetch post details
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/posts/${id}`);
      return response.data;
    },
  });

  // Fetch comments for this post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/posts/${id}/comments`);
      return response.data;
    },
    enabled: !!id,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ postId: _postId, voteType, userId }) => {
      const response = await axiosSecure.post(`/posts/${_postId}/vote`, {
        voteType,
        userId
      });
      return response.data;
    },
    onMutate: async ({ voteType }) => {
      await queryClient.cancelQueries(['post', id]);
      const previousPost = queryClient.getQueryData(['post', id]);
      
      queryClient.setQueryData(['post', id], (old) => {
        if (!old) return old;
        
        const newVotes = { ...(old.votes || {}) };
        const userVote = newVotes[user?.uid];
        let upVote = old.upVote || 0;
        let downVote = old.downVote || 0;
        
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
          // Remove vote if clicking the same button
          delete newVotes[user?.uid];
        }
        
        return {
          ...old,
          upVote: Math.max(0, upVote),
          downVote: Math.max(0, downVote),
          votes: newVotes
        };
      });
      
      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', id], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['post', id]);
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, comment }) => {
      const response = await axiosSecure.post(`/posts/${postId}/comments`, {
        comment,
        authorName: user.displayName || user.email,
        authorEmail: user.email,
        authorImage: user.photoURL || "/default-avatar.svg",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setCommentText("");
      setShowCommentForm(false);
    },
  });

  const handleVote = (voteType) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }
    console.log('Voting:', { postId: id, voteType, userId: user.uid });
    voteMutation.mutate({ 
      postId: id, 
      voteType,
      userId: user.uid // Make sure userId is included in the mutation
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    addCommentMutation.mutate({ postId: id, comment: commentText });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
          {/* Test button */}
          {/* <button 
            onClick={testClick}
            className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50 shadow-lg"
          >
            Test Button
          </button> */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Debug function to check if clicks are working
  const handleDebugClick = (e) => {
    if (e) e.stopPropagation();
    console.log('Debug button clicked!');
    alert('Debug button works!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Debug button */}
      <button 
        onClick={handleDebugClick}
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50 shadow-lg"
      >
        Debug Button
      </button>
      
      <div 
        className="max-w-4xl mx-auto px-4 py-8 relative"
        style={{ minHeight: '100vh' }}
      >
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          {/* Post Header */}
          <div className="flex items-start space-x-4 mb-6">
            <img
              src={post?.authorImage || "/default-avatar.svg"}
              alt={post?.authorName}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.svg";
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {post?.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post?.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post?.postTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Tags */}
          {post?.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />#{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Description */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {post?.description}
            </p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 relative" style={{ zIndex: 1 }}>
            <div className="flex items-center gap-6">
              {/* Test button */}
              {/* <button 
                onClick={() => alert('Test button works!')}
                className="p-2 bg-blue-500 text-white rounded-lg absolute top-[-50px] left-0 z-50"
              >
                Test Button
              </button> */}
              
              {/* Voting */}
              <div className="flex items-center gap-2 relative" style={{ zIndex: 1 }}>
                <button
                  onClick={() => handleVote("upvote")}
                  className={`p-2 rounded-lg transition-colors relative z-10 ${
                    post?.votes?.[user?.uid] === "upvote"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  disabled={!user || voteMutation.isLoading}
                  title={user ? "Upvote" : "Login to vote"}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                
                <span className="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                  {(post?.upVote || 0) - (post?.downVote || 0)}
                </span>
                
                <button
                  onClick={() => handleVote("downvote")}
                  className={`p-2 rounded-lg transition-colors ${
                    post?.votes?.[user?.uid] === "downvote"
                      ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  disabled={!user || voteMutation.isLoading}
                  title={user ? "Downvote" : "Login to vote"}
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              {/* Comments Count */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <FacebookShareButton
                  url={window.location.href}
                  quote={post?.title}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={window.location.href}
                  title={post?.title}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={window.location.href}
                  title={post?.title}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <LinkedinShareButton
                  url={window.location.href}
                  title={post?.title}
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user ? (
            <div className="mb-8">
              {!showCommentForm ? (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  Add a comment...
                </button>
              ) : (
                <form onSubmit={handleAddComment} className="space-y-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={
                        !commentText.trim() || addCommentMutation.isPending
                      }
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      {addCommentMutation.isPending
                        ? "Posting..."
                        : "Post Comment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommentForm(false);
                        setCommentText("");
                      }}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                Please{" "}
                <Link to="/login" className="underline font-medium">
                  login
                </Link>{" "}
                to add a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
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
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {comment.comment.length > 100 ? (
                          <>
                            {comment.comment.substring(0, 100)}...
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openCommentModal(comment);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          <>{comment.comment}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comment by {selectedComment.authorName}
                </h3>
                <button
                  onClick={closeCommentModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedComment.comment}
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Posted on {formatDate(selectedComment.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
