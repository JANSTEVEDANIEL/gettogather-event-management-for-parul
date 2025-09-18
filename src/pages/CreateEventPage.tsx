import React from 'react';
import { motion } from 'framer-motion';
import CreateEventForm from '../components/Events/CreateEventForm';
import { useNavigate } from 'react-router-dom';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEventCreated = () => {
    navigate('/events');
  };

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-6 py-8"
      >
        <CreateEventForm
          onClose={handleClose}
          onEventCreated={handleEventCreated}
        />
      </motion.div>
    </div>
  );
};

export default CreateEventPage;
