import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import AuthCallback from './components/Auth/AuthCallback';
import Navigation from './components/Layout/Navigation';
import FeedPage from './pages/FeedPage';
import EventsPage from './pages/EventsPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import { motion } from 'framer-motion';

function App() {
  const { user, isLoading } = useAuth();

  const renderRoutes = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    if (!user) {
      return (
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <main className="ml-0 md:ml-64 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<FeedPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/community" element={
              <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-white mb-4">Community</h1>
                <p className="text-gray-400">Connect with fellow students and faculty members. This feature is coming soon!</p>
              </div>
            } />
            {user.role === 'admin' && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/signin" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <BrowserRouter>
      {renderRoutes()}
    </BrowserRouter>
  );
}

export default App;
