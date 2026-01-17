import apiClient from './client';
import type { User, Post, Comment } from '../types';

export const usersApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/api/users/me');
    return data;
  },

  // Get user profile by username or ID
  getUserProfile: async (identifier: string | number): Promise<User> => {
    const { data } = await apiClient.get(`/api/users/${identifier}`);
    return data;
  },

  // Update current user profile
  updateProfile: async (payload: {
    bio?: string;
    avatar_url?: string;
  }): Promise<User> => {
    const { data } = await apiClient.put('/api/users/me', payload);
    return data;
  },

  // Get user's posts
  getUserPosts: async (
    identifier: string | number,
    limit = 20,
    offset = 0
  ): Promise<Post[]> => {
    const { data } = await apiClient.get(`/api/users/${identifier}/posts`, {
      params: { limit, offset },
    });
    return data;
  },

  // Get user's comments
  getUserComments: async (
    identifier: string | number,
    limit = 20,
    offset = 0
  ): Promise<Comment[]> => {
    const { data } = await apiClient.get(`/api/users/${identifier}/comments`, {
      params: { limit, offset },
    });
    return data;
  },
};