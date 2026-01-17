import { useState } from 'react';
import { MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post, Comment } from '../../types';
import PostCard from '../posts/PostCard';
import EmptyState from '../common/EmptyState';

interface UserActivityTabsProps {
  posts: Post[];
  comments: Comment[];
  onEditPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
}

type Tab = 'posts' | 'comments';

export default function UserActivityTabs({
  posts,
  comments,
  onEditPost,
  onDeletePost,
}: UserActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === 'posts'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={20} />
            Posts
            <span className="ml-1 text-sm text-gray-500">({posts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === 'comments'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={20} />
            Comments
            <span className="ml-1 text-sm text-gray-500">({comments.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'posts' ? (
          posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title="No posts yet"
              description="This user hasn't created any posts"
            />
          )
        ) : comments.length > 0 ? (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Comment header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    Commented on{' '}
                    <Link
                      to={`/posts/${comment.post_id}`}
                      className="text-orange-600 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      {comment.post?.title || 'a post'}
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Comment content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Comment metadata */}
                {comment.parent_id && (
                  <div className="mt-2 text-xs text-gray-500">
                    <MessageSquare size={12} className="inline mr-1" />
                    Reply to another comment
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquare size={48} />}
            title="No comments yet"
            description="This user hasn't made any comments"
          />
        )}
      </div>
    </div>
  );
}