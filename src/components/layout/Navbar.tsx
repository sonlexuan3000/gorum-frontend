import { Link } from 'react-router-dom';
import { MessageSquare, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import Container from './Container';
import NotificationBell from '../notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-40 shadow-soft">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-700 hover:text-primary-800 transition-colors">
            <MessageSquare size={28} strokeWidth={3} />
            <span>Gorum</span>
          </Link>

          {/* User menu */}
          {user && (
            <div className="flex items-center gap-4">
              <NotificationBell />
              
              <Link 
                to={`/profile/${user.username}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary-100 rounded-lg text-sm text-neutral-700 hover:bg-secondary-200 transition-colors"
              >
                <User size={16} />
                <span className="font-medium">{user.username}</span>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut size={18} strokeWidth={3} />
                Logout
              </Button>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}