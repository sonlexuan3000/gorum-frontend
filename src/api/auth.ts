import apiClient from './client';
import {type AuthResponse } from '../types';

export const authApi = {

  signup: async (payload: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', payload);
    return data;
  },

  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  // Existing getMe...
  getMe: async () => {
    const { data } = await apiClient.get('/api/me');
    return data;
  },
};