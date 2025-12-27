import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, User, Trash2, Edit } from 'lucide-react';
import {type Post } from '../../types';
import { formatRelativeTime } from '../../utils/formatDate';
import { useAuthStore } from '../../store/authStore';
import Card from '../common/Card';
import Button from '../common/Button';
import VoteButtons from './VoteButtons';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === post.created_by;

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between gap-4">

        <VoteButtons
          postId={post.id}
          initialVoteCount={post.vote_count}
          initialUserVote={post.user_vote}
        />

        <div className="flex-1 min-w-0">
          <Link 
            to={`/posts/${post.id}`}
            className="block group-hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {post.content}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.creator.username}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatRelativeTime(post.created_at)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>Comments</span>
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
                onEdit(post);
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
                onDelete(post);
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