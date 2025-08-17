import useAxios from "../hooks/useAxios";

const axiosSecure = useAxios();

/**
 * Handles voting on a post
 * @param {string} postId - The ID of the post to vote on
 * @param {string} voteType - The type of vote ('upvote' or 'downvote')
 * @param {string} userId - The ID of the user casting the vote
 * @returns {Promise} - The API response
 */
export const votePost = async (postId, voteType, userId) => {
  try {
    // Changed from PATCH to POST to match server endpoint
    const response = await axiosSecure.post(`/posts/${postId}/vote`, {
      voteType,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error voting on post:', error);
    throw error;
  }
};