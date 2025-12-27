import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const fetchData = async () => {
    if (!topicId) return;
    setIsLoading(true);
    try {
      const [topicData, postsData] = await Promise.all([
        topicsApi.getById(parseInt(topicId)),
        postsApi.getByTopicId(parseInt(topicId), currentQuery),
      ]);
      setTopic(topicData);
      setPosts(postsData);
    } catch (error) {
      toast.error('Failed to load topic');
      console.error(error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchTerm(currentQuery);
  }, [topicId, currentQuery]);

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

  if (isLoading && !topic) {
    return (
      <Container>
        <Loading text="Loading topic..." />
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
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Topics
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
          {topic.description && (
            <p className="text-gray-600">{topic.description}</p>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 flex-shrink-0 self-start"
        >
          <Plus size={20} />
          New Post
        </Button>
      </div>

      <div className="flex justify-end mb-6">
        <form onSubmit={handleSearch} className="relative w-64 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white 
                       focus:border-orange-300 focus:ring-4 focus:ring-orange-100 
                       outline-none transition-all shadow-sm hover:shadow-md text-sm text-gray-700"
          />
        </form>
      </div>

      {isLoading ? (
          <div className="py-10">
              <Loading text="Searching posts..." />
          </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={currentQuery ? <Search size={48} /> : <Plus size={48} />}
          title={currentQuery ? `No results for "${currentQuery}"` : "No posts yet"}
          description={currentQuery 
            ? "Oops! We couldn't find any posts matching your search." 
            : "Be the first to create a post in this topic"}
          action={
            !currentQuery ? (
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                Create First Post
                </Button>
            ) : (
                <Button variant="secondary" onClick={() => {
                    setSearchParams({});
                    setSearchTerm('');
                }}>
                    Clear Search
                </Button>
            )
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

      <CreatePostModal
        isOpen={isCreateModalOpen || editingPost !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        editPost={editingPost}
      />

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