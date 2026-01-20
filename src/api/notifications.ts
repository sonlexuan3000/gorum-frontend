import apiClient from './client';
import type { Notification } from '../types';

export const notificationsApi = {
  getNotifications: async (limit = 20, offset = 0): Promise<Notification[]> => {
    const { data } = await apiClient.get('/api/notifications', {
      params: { limit, offset },
    });
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get('/api/notifications/unread-count');
    return data.unread_count;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.put(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/api/notifications/mark-all-read');
  },
};