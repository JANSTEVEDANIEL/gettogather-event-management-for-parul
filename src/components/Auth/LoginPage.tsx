import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';

const LoginPage: React.FC = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      await authService.signInWithGoogle();
      // The page will redirect, so no need to set isSigningIn back to false
    } catch (error) {
      console.error("Google Sign-In failed to initiate:", error);
      setIsSigningIn(false); // Reset on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-primary-500/10 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Gettogather</h1>
            <p className="text-gray-400">Sign in to your Parul University account</p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
            >
              <img src="https://www.google.com/s2/favicons?domain=google.com" alt="Google" className="w-5 h-5 mr-3" />
              <span className="font-medium text-gray-200">{isSigningIn ? 'Redirecting to Google...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
      <footer className="text-center mt-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Designed by Jatin Jalpesh Shah, Upadhyay Gaurav, Arunav Roy Sarkar, Ravi Ranjan, Smith Patel and R Jan Steve Daniel
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
