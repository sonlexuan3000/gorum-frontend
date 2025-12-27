import apiClient from './client';
import {type Comment } from '../types';

export const commentsApi = {
  getByPostId: async (postId: number): Promise<Comment[]> => {
    const { data } = await apiClient.get(`/api/posts/${postId}/comments`);
    return data;
  },

  getById: async (id: number): Promise<Comment> => {
    const { data } = await apiClient.get(`/api/comments/${id}`);
    return data;
  },

  create: async (payload: {
    post_id: number;
    content: string;
    parent_id?: number;
  }): Promise<Comment> => {
    const { data } = await apiClient.post('/api/comments', payload);
    return data;
  },

  update: async (id: number, payload: { content: string }): Promise<Comment> => {
    const { data } = await apiClient.put(`/api/comments/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/comments/${id}`);
  },
};