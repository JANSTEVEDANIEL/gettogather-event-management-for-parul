import React from 'react';
import { motion } from 'framer-motion';

const AuthCallback: React.FC = () => {
  // The onAuthStateChange listener in AuthContext handles all session processing.
  // This component simply provides a user-friendly loading screen during the
  // brief period of authentication and redirection. All navigation logic is
  // handled centrally by the main App component based on the user's auth state.

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Authenticating</h2>
        <p className="text-gray-400 mt-2">Please wait while we securely sign you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
