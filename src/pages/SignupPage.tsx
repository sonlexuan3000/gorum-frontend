import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

export default function SignupPage() {
  //states
  
  const [username, setUsername] = useState('');  
  const [email, setEmail] = useState('');        
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [errors, setErrors] = useState<{         
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false); 

 
  
  const { setAuth } = useAuthStore();  
  const navigate = useNavigate();      

  
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (username.length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
    }


    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (password.length > 100) {
      newErrors.password = 'Password must be less than 100 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors); 
    return Object.keys(newErrors).length === 0; 
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrors({});      

    if (!validate()) return; 

    setIsLoading(true); 

    try {
     
      const data = await authApi.signup({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      
      setAuth(data.user, data.token);           
      toast.success(`Welcome, ${data.user.username}!`); 
      navigate('/');                            
      
    } catch (err: any) {
      
      const errorMessage = err.response?.data?.error || 'Failed to sign up';
      
    
      if (errorMessage.includes('Email already registered')) {
        setErrors({ email: 'This email is already registered' });
      } else if (errorMessage.includes('Username already taken')) {
        setErrors({ username: 'This username is already taken' });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false); 
    }
  };

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <UserPlus className="text-primary-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Account</h1>
          <p className="text-neutral-600">Join our community today</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            error={errors.username}
            disabled={isLoading}
            autoFocus 
          />

          {/* Email Input */}
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          {/* Link to Login */}
          <p className="text-sm text-neutral-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}