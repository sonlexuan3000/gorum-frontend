import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import type { Topic, Post } from '../types';
import { topicsApi } from '../api/topics';
import { postsApi } from '../api/posts';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import PostCard from '../components/posts/PostCard';
import CreatePostModal from '../components/posts/CreatePostModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch topic and posts
  const fetchData = async () => {
    if (!topicId) return;

    try {
      const [topicData, postsData] = await Promise.all([
        topicsApi.getById(parseInt(topicId)),
        postsApi.getByTopicId(parseInt(topicId)),
      ]);
      setTopic(topicData);
      setPosts(postsData);
    } catch (error) {
      toast.error('Failed to load topic');
      console.error('Error fetching data:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [topicId]);

  // Create post
  const handleCreatePost = async (data: { title: string; content: string }) => {
    if (!topicId) return;

    try {
      const newPost = await postsApi.create({
        topic_id: parseInt(topicId),
        title: data.title,
        content: data.content,
      });
      setPosts([newPost, ...posts]);
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
      throw error;
    }
  };

  // Update post
  const handleUpdatePost = async (data: { title: string; content: string }) => {
    if (!editingPost) return;

    try {
      const updatedPost = await postsApi.update(editingPost.id, data);
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      toast.success('Post updated successfully');
      setEditingPost(null);
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!deletingPost) return;

    setIsDeleting(true);
    try {
      await postsApi.delete(deletingPost.id);
      setPosts(posts.filter(p => p.id !== deletingPost.id));
      toast.success('Post deleted successfully');
      setDeletingPost(null);
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading posts..." />
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container>
        <EmptyState
          title="Topic not found"
          description="The topic you're looking for doesn't exist"
          action={
            <Link to="/">
              <Button variant="primary">Back to Home</Button>
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
        to="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Topics
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
          {topic.description && (
            <p className="text-gray-600">{topic.description}</p>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={20} />
          New Post
        </Button>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<Plus size={48} />}
          title="No posts yet"
          description="Be the first to create a post in this topic"
          action={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create First Post
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={setEditingPost}
              onDelete={setDeletingPost}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen || editingPost !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        editPost={editingPost}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingPost !== null}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message={`Are you sure you want to delete "${deletingPost?.title}"? This action cannot be undone and will delete all comments on this post.`}
        isDeleting={isDeleting}
      />
    </Container>
  );
}