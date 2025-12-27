import apiClient from './client';
import {type Post } from '../types';

export const postsApi = {
  getByTopicId: async (topicId: number): Promise<Post[]> => {
    const { data } = await apiClient.get(`/api/topics/${topicId}/posts`);
    return data;
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/api/posts/${id}`);
    return data;
  },

  create: async (payload: {
    topic_id: number;
    title: string;
    content: string;
  }): Promise<Post> => {
    const { data } = await apiClient.post('/api/posts', payload);
    return data;
  },

  update: async (
    id: number,
    payload: { title: string; content: string }
  ): Promise<Post> => {
    const { data } = await apiClient.put(`/api/posts/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`);
  },
};