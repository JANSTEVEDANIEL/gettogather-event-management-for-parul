import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Upload, Tag, Users } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateEventFormProps {
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onClose, onEventCreated }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Academic',
    maxAttendees: '',
    tags: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Create event
      const eventData = {
        ...formData,
        organizer_id: user.id,
        max_attendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'upcoming' as const
      };

      const event = await eventService.createEvent(eventData);

      // Upload image if selected
      if (selectedImage && event.id) {
        const imageUrl = await eventService.uploadEventImage(selectedImage, event.id);
        await eventService.updateEvent(event.id, { image_url: imageUrl });
      }

      onEventCreated();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const iconInputClasses = "w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Create New Event</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={inputClasses}
              placeholder="Describe your event"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={iconInputClasses}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={iconInputClasses}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={iconInputClasses}
                placeholder="Event location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={inputClasses}
              >
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Attendees</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  className={iconInputClasses}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={iconInputClasses}
                placeholder="Separate tags with commas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Image</label>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400 mb-2">Upload an image for your event</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
              >
                Choose File
              </label>
              {selectedImage && (
                <p className="text-sm text-gray-400 mt-2">{selectedImage.name}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateEventForm;
