import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { votesApi } from '../../api/votes';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  postId: number;
  initialVoteCount: number;
  initialUserVote: number; 
}

export default function VoteButtons({ 
  postId, 
  initialVoteCount, 
  initialUserVote 
}: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 1 | -1) => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      if (userVote === voteType) {
        const data = await votesApi.unvote(postId);
        setVoteCount(data.vote_count);
        setUserVote(0);
      } else {
        const data = await votesApi.vote(postId, voteType);
        setVoteCount(data.vote_count);
        setUserVote(data.user_vote);
      }
    } catch (error) {
      toast.error('Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={cn(
          'p-1 rounded hover:bg-secondary-100 transition-colors',
          userVote === 1 && 'text-accent-600 bg-accent-50'
        )}
      >
        <ChevronUp size={20} />
      </button>
      
      <span className={cn(
        'text-sm font-semibold',
        userVote === 1 && 'text-accent-600',
        userVote === -1 && 'text-red-600'
      )}>
        {voteCount}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={cn(
          'p-1 rounded hover:bg-secondary-100 transition-colors',
          userVote === -1 && 'text-red-600 bg-red-50'
        )}
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
}