import apiClient from './client';
import {type Topic } from '../types';

export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get('/api/topics');
    return data;
  },

  getById: async (id: number): Promise<Topic> => {
    const { data } = await apiClient.get(`/api/topics/${id}`);
    return data;
  },

  create: async (payload: { title: string; description: string }): Promise<Topic> => {
    const { data } = await apiClient.post('/api/topics', payload);
    return data;
  },

  update: async (id: number, payload: { title: string; description: string }): Promise<Topic> => {
    const { data } = await apiClient.put(`/api/topics/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/topics/${id}`);
  },
};