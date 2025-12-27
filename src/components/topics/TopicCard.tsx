import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, User, Trash2, Edit } from 'lucide-react';
import {type Topic } from '../../types';
import { formatRelativeTime } from '../../utils/formatDate';
import { useAuthStore } from '../../store/authStore';
import Card from '../common/Card';
import Button from '../common/Button';

interface TopicCardProps {
  topic: Topic;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
}

export default function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === topic.created_by;

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link 
            to={`/topics/${topic.id}`}
            className="block group-hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {topic.title}
            </h3>
          </Link>
          
          {topic.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {topic.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{topic.creator.username}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatRelativeTime(topic.created_at)}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onEdit(topic);
              }}
              className="!p-2"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete(topic);
              }}
              className="!p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}