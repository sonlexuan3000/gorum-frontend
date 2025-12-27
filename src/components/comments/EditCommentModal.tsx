import { useState, useEffect } from 'react';
import {type Comment } from '../../types';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  comment: Comment | null;
}

export default function EditCommentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  comment 
}: EditCommentModalProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
    setError('');
  }, [comment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 5000) {
      setError('Comment must be less than 5000 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      onClose();
    } catch (error) {
      setError('Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Comment"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={error}
          disabled={isSubmitting}
          rows={6}
          autoFocus
        />

        <div className="flex justify-end gap-3">
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
            Update Comment
          </Button>
        </div>
      </form>
    </Modal>
  );
}