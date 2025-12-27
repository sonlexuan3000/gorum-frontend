import { useState, useEffect } from 'react';
import { Plus, Loader, FilePen } from 'lucide-react';
import {type Topic } from '../types';
import { topicsApi } from '../api/topics';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import TopicCard from '../components/topics/TopicCard';
import CreateTopicModal from '../components/topics/CreateTopicModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const data = await topicsApi.getAll();
      setTopics(data);
    } catch (error) {
      toast.error('Failed to load topics');
      console.error('Error fetching topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Create topic
  const handleCreateTopic = async (data: { title: string; description: string }) => {
    try {
      const newTopic = await topicsApi.create(data);
      setTopics([newTopic, ...topics]);
      toast.success('Topic created successfully');
    } catch (error) {
      toast.error('Failed to create topic');
      throw error;
    }
  };

  // Update topic
  const handleUpdateTopic = async (data: { title: string; description: string }) => {
    if (!editingTopic) return;

    try {
      const updatedTopic = await topicsApi.update(editingTopic.id, data);
      setTopics(topics.map(t => t.id === updatedTopic.id ? updatedTopic : t));
      toast.success('Topic updated successfully');
      setEditingTopic(null);
    } catch (error) {
      toast.error('Failed to update topic');
      throw error;
    }
  };

  // Delete topic
  const handleDeleteTopic = async () => {
    if (!deletingTopic) return;

    setIsDeleting(true);
    try {
      await topicsApi.delete(deletingTopic.id);
      setTopics(topics.filter(t => t.id !== deletingTopic.id));
      toast.success('Topic deleted successfully');
      setDeletingTopic(null);
    } catch (error) {
      toast.error('Failed to delete topic');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading topics..." />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Topics</h1>
          <p className="text-gray-600">Browse and discuss various topics</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FilePen size={20} />
          Create Topic
        </Button>
      </div>

      {/* Topics list */}
      {topics.length === 0 ? (
        <EmptyState
          icon={<FilePen size={48} />}
          title="No topics yet"
          description="Be the first to create a topic and start a discussion"
          action={
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create First Topic
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={setEditingTopic}
              onDelete={setDeletingTopic}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateTopicModal
        isOpen={isCreateModalOpen || editingTopic !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
        editTopic={editingTopic}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingTopic !== null}
        onClose={() => setDeletingTopic(null)}
        onConfirm={handleDeleteTopic}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deletingTopic?.title}"? This action cannot be undone and will delete all posts and comments in this topic.`}
        isDeleting={isDeleting}
      />
    </Container>
  );
}