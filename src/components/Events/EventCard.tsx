import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Heart, Share2, MessageCircle } from 'lucide-react';
import { Event } from '../../types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  variant?: 'feed' | 'grid';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'feed' }) => {
  const [liked, setLiked] = React.useState(false);

  if (variant === 'grid') {
    return (
      <Link to={`/events/${event.id}`} className="block">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gray-800 rounded-2xl shadow-lg shadow-black/20 border border-gray-700 overflow-hidden hover:border-primary-500 transition-all duration-300 h-full flex flex-col"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={event.image || `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x200/1f2937/ffffff?text=${encodeURIComponent(event.title)}`}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-full">
                {event.category}
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' :
                event.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {event.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
            <p className="text-gray-400 mb-4 line-clamp-2 flex-grow">{event.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar size={16} className="mr-2" />
                {format(new Date(event.date), 'MMM dd, yyyy', { locale: enGB })} at {event.time}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin size={16} className="mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Users size={16} className="mr-2" />
                {event.attendees.length} attending
              </div>
            </div>
            
            <button className="w-full bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium mt-auto">
              View Details
            </button>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl shadow-lg shadow-black/20 border border-gray-700 overflow-hidden mb-6"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={event.organizer.avatar}
            alt={event.organizer.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-white">{event.organizer.name}</h4>
            <p className="text-gray-400 text-sm">created an event • {format(new Date(event.createdAt), 'MMM dd', { locale: enGB })}</p>
          </div>
          <div className="flex space-x-1">
            {event.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <Link to={`/events/${event.id}`}>
          <h2 className="text-2xl font-bold text-white mb-3 hover:text-primary-400 transition-colors">{event.title}</h2>
          <p className="text-gray-300 mb-4">{event.description}</p>

          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden">
            <img
              src={event.image || `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x300/1f2937/ffffff?text=${encodeURIComponent(event.title)}`}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center text-gray-300">
            <Calendar size={18} className="mr-2 text-primary-400" />
            <div>
              <p className="font-medium">{format(new Date(event.date), 'MMM dd, yyyy', { locale: enGB })}</p>
              <p className="text-sm">{event.time}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin size={18} className="mr-2 text-primary-400" />
            <div>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex space-x-6">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span className="font-medium">Like</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-200">
              <MessageCircle size={20} />
              <span className="font-medium">Comment</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-200">
              <Share2 size={20} />
              <span className="font-medium">Share</span>
            </button>
          </div>
          
          <div className="flex items-center text-gray-400">
            <Users size={16} className="mr-1" />
            <span className="text-sm">{event.attendees.length} attending</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
