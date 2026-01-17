import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import UserProfilePage from './pages/UserProfilePage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#292524',
            border: '1px solid #e4dace',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#c88653',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/topics/:topicId"
          element={
            <ProtectedRoute>
              <Layout>
                <TopicPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <Layout>
                <PostPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <Layout>
                <UserProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;