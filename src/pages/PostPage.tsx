import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MessageSquare } from 'lucide-react';
import type { Post, Comment } from '../types';
import { postsApi } from '../api/posts';
import { commentsApi } from '../api/comments';
import Container from '../components/layout/Container';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import EditCommentModal from '../components/comments/EditCommentModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import { formatRelativeTime } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { countTotalComments } from '../utils/countComments';
import VoteButtons from '../components/posts/VoteButtons';

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const totalComments = countTotalComments(comments);
  // Fetch post and comments
  const fetchData = async () => {
    if (!postId) return;

    try {
      const [postData, commentsData] = await Promise.all([
        postsApi.getById(parseInt(postId)),
        commentsApi.getByPostId(parseInt(postId)),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching data:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  // Create comment
  const handleCreateComment = async (content: string) => {
    if (!postId) return;

    try {
      const newComment = await commentsApi.create({
        post_id: parseInt(postId),
        content,
      });
      
      // Add to top of comments list
      setComments([newComment, ...comments]);
      toast.success('Comment posted successfully');
    } catch (error) {
      toast.error('Failed to post comment');
      throw error;
    }
  };

  // Reply to comment
  const handleReplyComment = async (parentId: number, content: string) => {
    if (!postId) return;

    try {
      const newComment = await commentsApi.create({
        post_id: parseInt(postId),
        content,
        parent_id: parentId,
      });

      // Refresh comments to show nested structure
      const updatedComments = await commentsApi.getByPostId(parseInt(postId));
      setComments(updatedComments);
      toast.success('Reply posted successfully');
    } catch (error) {
      toast.error('Failed to post reply');
      throw error;
    }
  };

  // Update comment
  const handleUpdateComment = async (content: string) => {
    if (!editingComment || !postId) return;

    try {
      await commentsApi.update(editingComment.id, { content });
      
      // Refresh comments
      const updatedComments = await commentsApi.getByPostId(parseInt(postId));
      setComments(updatedComments);
      toast.success('Comment updated successfully');
      setEditingComment(null);
    } catch (error) {
      toast.error('Failed to update comment');
      throw error;
    }
  };

  // Delete comment
  const handleDeleteComment = async () => {
    if (!deletingComment || !postId) return;

    setIsDeleting(true);
    try {
      await commentsApi.delete(deletingComment.id);
      
      // Refresh comments
      const updatedComments = await commentsApi.getByPostId(parseInt(postId));
      setComments(updatedComments);
      toast.success('Comment deleted successfully');
      setDeletingComment(null);
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading post..." />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <EmptyState
          title="Post not found"
          description="The post you're looking for doesn't exist"
          action={
            <Link to="/">
              <button className="btn-primary">Back to Home</button>
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      {/* Back button */}
      <Link 
        to={`/topics/${post.topic_id}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Posts
      </Link>

      {/* Post content */}
      <Card className="mb-8">
        <div className="flex items-start gap-4">
            <VoteButtons
                postId={post.id}
                initialVoteCount={post.vote_count}
                initialUserVote={post.user_vote}
            />
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-4 border-b">
                <div className="flex items-center gap-1">
                    <User size={16} />
                    <span className="font-medium">{post.creator.username}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatRelativeTime(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>{totalComments} {totalComments === 1 ? 'comment' : 'comments'}</span>
                </div>
                </div>

                <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                    {post.content}
                </p>
                </div>
            </div>
        </div>
      </Card>

      {/* Comments section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({totalComments})
        </h2>

        {/* Comment form */}
        <Card className="mb-6">
          <CommentForm 
            onSubmit={handleCreateComment}
            placeholder="Write a comment..."
            buttonText="Post Comment"
          />
        </Card>

        {/* Comments list */}
        <CommentList
          comments={comments}
          onReply={handleReplyComment}
          onEdit={setEditingComment}
          onDelete={setDeletingComment}
        />
      </div>

      {/* Edit Comment Modal */}
      <EditCommentModal
        isOpen={editingComment !== null}
        onClose={() => setEditingComment(null)}
        onSubmit={handleUpdateComment}
        comment={editingComment}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingComment !== null}
        onClose={() => setDeletingComment(null)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </Container>
  );
}