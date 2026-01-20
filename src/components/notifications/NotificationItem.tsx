import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Reply } from 'lucide-react';
import type { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/formatDate';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onClose: () => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const getNotificationConfig = () => {
    switch (notification.type) {
      case 'vote':
        return {
          icon: <ThumbsUp size={16} />,
          color: 'text-orange-600 bg-orange-100',
          text: `upvoted your post "${notification.post?.title || 'your post'}"`,
        };
      case 'comment':
        return {
          icon: <MessageSquare size={16} />,
          color: 'text-blue-600 bg-blue-100',
          text: `commented on your post "${notification.post?.title || 'your post'}"`,
        };
      case 'reply':
        return {
          icon: <Reply size={16} />,
          color: 'text-green-600 bg-green-100',
          text: `replied to your comment`,
        };
      default:
        return {
          icon: <MessageSquare size={16} />,
          color: 'text-gray-600 bg-gray-100',
          text: 'interacted with your content',
        };
    }
  };

  const config = getNotificationConfig();
  const postUrl = notification.post_id ? `/posts/${notification.post_id}` : '#';

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  return (
    <Link
      to={postUrl}
      onClick={handleClick}
      className={`block p-4 hover:bg-gray-50 transition-colors ${
        !notification.is_read ? 'bg-orange-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.color}`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">
              {notification.actor?.username || 'Someone'}
            </span>{' '}
            {config.text}
          </p>

          {/* Comment preview for comment/reply notifications */}
          {(notification.type === 'comment' || notification.type === 'reply') &&
            notification.comment?.content && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2 italic">
                "{notification.comment.content}"
              </p>
            )}

          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(notification.created_at)}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.is_read && (
          <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
        )}
      </div>
    </Link>
  );
}