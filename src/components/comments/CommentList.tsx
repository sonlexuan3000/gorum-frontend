import {type Comment as CommentType } from '../../types';
import Comment from './Comment';
import EmptyState from '../common/EmptyState';
import { MessageSquare } from 'lucide-react';

interface CommentListProps {
  comments: CommentType[];
  onReply: (parentId: number, content: string) => Promise<void>;
  onEdit: (comment: CommentType) => void;
  onDelete: (comment: CommentType) => void;
}

export default function CommentList({ 
  comments, 
  onReply, 
  onEdit, 
  onDelete 
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare size={48} />}
        title="No comments yet"
        description="Be the first to comment on this post"
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}