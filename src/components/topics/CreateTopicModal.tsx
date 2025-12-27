import { useState, useEffect } from 'react';
import {type Topic } from '../../types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  editTopic?: Topic | null;
}

export default function CreateTopicModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editTopic 
}: CreateTopicModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTopic) {
      setTitle(editTopic.title);
      setDescription(editTopic.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({});
  }, [editTopic, isOpen]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      onClose();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTopic ? 'Edit Topic' : 'Create New Topic'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Enter topic title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          disabled={isSubmitting}
          autoFocus
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Enter topic description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          disabled={isSubmitting}
          rows={4}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {editTopic ? 'Update Topic' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}