import { User, Camera, Calendar } from 'lucide-react';
import Button from '../common/Button';

interface ProfileHeaderProps {
  user: {
    id: number;
    username: string;
    avatar_url?: string;
    bio?: string;
    posts_count?: number;
    comments_count?: number;
    created_at: string;
  };
  isOwnProfile: boolean;
  onEditProfile?: () => void;
}

export default function ProfileHeader({ user, isOwnProfile, onEditProfile }: ProfileHeaderProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-white" />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.username}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {isOwnProfile && (
              <Button
                variant="secondary"
                onClick={onEditProfile}
                className="flex items-center gap-2"
              >
                <Camera size={18} />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {user.posts_count || 0}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {user.comments_count || 0}
              </div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}