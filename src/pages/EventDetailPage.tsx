import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, Share2, Send, AlertTriangle } from 'lucide-react';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setError("Event ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const realEvent = await eventService.getEventById(eventId);
        if (realEvent) {
          setEvent(realEvent);
        } else {
          setError(`The event with ID "${eventId}" could not be found.`);
        }
      } catch (e) {
        console.error("Failed to fetch event:", e);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-700 rounded-2xl w-full mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-700 rounded-2xl"></div>
              <div className="h-48 bg-gray-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-2xl font-bold text-white">Event Not Found</h2>
          <p className="text-gray-400 mt-2">{error || "The event you are looking for does not exist."}</p>
          <Link to="/events" className="mt-8 inline-block bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <div className="h-48 md:h-64 lg:h-80 w-full overflow-hidden">
        <img
          src={event.image || `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/1200x400/1f2937/ffffff?text=${encodeURIComponent(event.title)}`}
          alt={`${event.title} banner`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="transform -translate-y-12 md:-translate-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 md:p-8 border border-gray-700"
            >
              <span className="text-primary-400 font-semibold text-sm uppercase">{event.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">{event.title}</h1>
              
              <div className="flex items-center space-x-4 mb-8">
                <img src={event.organizer.avatar} alt={event.organizer.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-gray-400 text-sm">Organized by</p>
                  <p className="font-semibold text-white">{event.organizer.name}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">About this event</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                {event.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-6">Discussion</h2>
                <div className="flex items-start space-x-4">
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder="Add a comment..."
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 text-white"
                      ></textarea>
                      <button className="absolute right-3 bottom-3 text-primary-400 hover:text-primary-500">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">Comments feature coming soon!</p>
              </div>

            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 border border-gray-700">
                <button className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 font-bold text-lg transition-all duration-200">
                  Join Event
                </button>
                <div className="mt-6 space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-4 mt-1 text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{format(new Date(event.date), 'EEEE, MMMM dd, yyyy', { locale: enGB })}</p>
                      <p className="text-sm text-gray-400">Event Date</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock size={20} className="mr-4 mt-1 text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{event.time}</p>
                      <p className="text-sm text-gray-400">Starts at</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-4 mt-1 text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{event.location}</p>
                      <p className="text-sm text-gray-400">Venue</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white flex items-center">
                    <Users size={18} className="mr-2" />
                    Attendees ({event.attendees.length})
                  </h3>
                  <a href="#" className="text-sm text-primary-400 hover:underline">See all</a>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {event.attendees.slice(0, 10).map(attendee => (
                    <img key={attendee.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-800" src={attendee.avatar} alt={attendee.name} title={attendee.name} />
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 border border-gray-700">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <Share2 size={18} className="mr-2" />
                  Share this event
                </h3>
                <div className="flex space-x-4">
                  <button className="flex-1 text-center py-2 border border-gray-600 rounded-lg hover:bg-gray-700">Facebook</button>
                  <button className="flex-1 text-center py-2 border border-gray-600 rounded-lg hover:bg-gray-700">Twitter</button>
                  <button className="flex-1 text-center py-2 border border-gray-600 rounded-lg hover:bg-gray-700">LinkedIn</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
