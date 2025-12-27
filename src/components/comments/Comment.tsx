import { useState } from 'react';
import { Reply, Trash2, Edit, Calendar, User } from 'lucide-react';
import {type Comment as CommentType } from '../../types';
import { formatRelativeTime } from '../../utils/formatDate';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import CommentForm from './CommentForm';

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: number, content: string) => Promise<void>;
  onEdit: (comment: CommentType) => void;
  onDelete: (comment: CommentType) => void;
  depth?: number;
}

export default function Comment({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete,
  depth = 0 
}: CommentProps) {
  const { user } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const isOwner = user?.id === comment.created_by;

  const handleReply = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Comment header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="font-medium text-gray-900">
                {comment.creator.username}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatRelativeTime(comment.created_at)}</span>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(comment)}
                className="!p-1.5"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment)}
                className="!p-1.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Comment content */}
        <p className="text-gray-700 mb-3 whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        {/* Reply button */}
        {canReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 !p-1.5 text-gray-600"
          >
            <Reply size={14} />
            Reply
          </Button>
        )}

        {/* Reply form */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReply}
              placeholder={`Reply to ${comment.creator.username}...`}
              buttonText="Reply"
              autoFocus
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}