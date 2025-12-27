import { useState } from 'react';
import Button from '../common/Button';
import Textarea from '../common/Textarea';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export default function CommentForm({ 
  onSubmit, 
  placeholder = "Write a comment...",
  buttonText = "Comment",
  autoFocus = false,
  onCancel
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setContent('');
    } catch (error) {
      setError('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={error}
        disabled={isSubmitting}
        rows={3}
        autoFocus={autoFocus}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}