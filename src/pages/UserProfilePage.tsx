import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { User, Post, Comment } from '../types';
import { usersApi } from '../api/users';
import Container from '../components/layout/Container';
import ProfileHeader from '../components/user/ProfileHeader';
import UserActivityTabs from '../components/user/UserActivityTabs';
import EditProfileModal from '../components/user/EditProfileModal';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if this is the current user's profile
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnProfile = user?.id === currentUser.id;

  const fetchUserData = async () => {
    if (!username) return;

    setIsLoading(true);
    try {
      const [userData, userPosts, userComments] = await Promise.all([
        usersApi.getUserProfile(username),
        usersApi.getUserPosts(username),
        usersApi.getUserComments(username),
      ]);

      setUser(userData);
      setPosts(userPosts);
      setComments(userComments);
    } catch (error) {
      toast.error('Failed to load user profile');
      console.error(error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const handleUpdateProfile = async (data: { bio: string; avatar_url: string }) => {
    try {
      const updatedUser = await usersApi.updateProfile(data);
      setUser(updatedUser);
      
      // Update localStorage if it's current user
      if (isOwnProfile) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading profile..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <EmptyState
          title="User not found"
          description="The user you're looking for doesn't exist"
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="space-y-6">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => setIsEditModalOpen(true)}
        />

        <UserActivityTabs
          posts={posts}
          comments={comments}
        />
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        currentBio={user.bio}
        currentAvatarUrl={user.avatar_url}
      />
    </Container>
  );
}