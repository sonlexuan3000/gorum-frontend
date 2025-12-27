import apiClient from './client';

export const votesApi = {
  vote: async (postId: number, voteType: 1 | -1) => {
    const { data } = await apiClient.post(`/api/posts/${postId}/vote`, {
      vote_type: voteType,
    });
    return data;
  },

  unvote: async (postId: number) => {
    const { data } = await apiClient.delete(`/api/posts/${postId}/vote`);
    return data;
  },
};