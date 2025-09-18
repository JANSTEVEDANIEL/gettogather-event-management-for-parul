import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Event } from '../types';
import EventCard from '../components/Events/EventCard';
import { Search, Filter, TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { eventService } from '../services/eventService';
import { grokService } from '../services/grokService';
import { useDebounce } from '../hooks/useDebounce';
import { faker } from '@faker-js/faker';

const FeedPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    
    let filters: any = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
    };

    if (debouncedSearchTerm) {
      setIsAiSearching(true);
      const aiFilters = await grokService.parseSearchQuery(debouncedSearchTerm);
      setIsAiSearching(false);
      
      filters = {
        ...filters,
        search: aiFilters.searchTerm,
        category: aiFilters.category || filters.category,
        status: aiFilters.status,
        dateRange: aiFilters.dateRange,
      };
    }

    const realEvents = await eventService.getEvents(filters);
    setEvents(realEvents);
    setIsLoading(false);
  }, [debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const trendingTopics = ['TechFest2025', 'CulturalNight', 'Hackathon', 'CareerFair', 'SportsDay'];

  const getLoadingMessage = () => {
    if (isAiSearching) {
      return "Grok is analyzing your search...";
    }
    if (isLoading) {
      return "Fetching events...";
    }
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening at Parul University.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search with AI: 'tech events next week'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border bg-gray-700 border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border bg-gray-700 border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>
          </div>

          {(isLoading || isAiSearching) ? (
            <div className="text-center p-10 flex flex-col items-center justify-center">
              {isAiSearching ? (
                <Sparkles className="w-8 h-8 animate-pulse text-accent-400 mb-4" />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
              )}
              <p className="text-gray-400">{getLoadingMessage()}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} event={event} variant="feed" />
                ))
              ) : (
                <div className="text-center p-10 bg-gray-800 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white">No Events Found</h3>
                  <p className="text-gray-400 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-80">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-8">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-primary-400" size={20} />
              <h3 className="font-bold text-white">Trending</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.div key={topic} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 rounded-xl bg-gray-700/50 hover:bg-primary-500/10 transition-colors duration-200 cursor-pointer">
                  <span className="font-medium text-gray-300">#{topic}</span>
                  <span className="text-sm text-gray-400">{faker.number.int({ min: 50, max: 500 })}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
