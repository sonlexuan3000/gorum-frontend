import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCheck } from 'lucide-react';
import type { Notification } from '../types';
import { notificationsApi } from '../api/notifications';
import Container from '../components/layout/Container';
import NotificationItem from '../components/notifications/NotificationItem';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsApi.getNotifications(50, 0);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading notifications..." />
      </Container>
    );
  }

  return (
    <Container>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={28} />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck size={18} />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<Bell size={64} />}
              title="No notifications"
              description="You're all caught up! We'll notify you when something new happens."
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onClose={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}