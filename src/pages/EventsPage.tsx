import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Grid, Plus } from 'lucide-react';
import { Event } from '../types';
import EventCard from '../components/Events/EventCard';
import { faker } from '@faker-js/faker';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Generate mock events with dates spread across the current month
    const mockEvents: Event[] = Array.from({ length: 12 }, () => ({
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement([
        'Tech Workshop: AI & Machine Learning',
        'Cultural Festival Opening Ceremony',
        'Sports Tournament Finals',
        'Guest Lecture: Industry Trends',
        'Student Project Exhibition',
        'Annual Day Preparations',
        'Department Seminar',
        'Career Guidance Session'
      ]),
      description: faker.lorem.sentences(2),
      date: faker.date.between({ 
        from: startOfMonth(new Date()), 
        to: endOfMonth(new Date()) 
      }),
      time: faker.helpers.arrayElement(['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM']),
      location: faker.helpers.arrayElement([
        'Main Auditorium',
        'Computer Lab 2',
        'Sports Complex',
        'Conference Room A',
        'Library Hall',
        'Outdoor Stage'
      ]),
      category: faker.helpers.arrayElement(['Technology', 'Cultural', 'Sports', 'Academic', 'Professional']),
      organizer: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        avatar: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/100x100/6366f1/ffffff?text=${faker.person.firstName().charAt(0)}`,
        role: 'user'
      },
      attendees: Array.from({ length: faker.number.int({ min: 10, max: 200 }) }, () => ({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: 'user' as const
      })),
      maxAttendees: faker.number.int({ min: 50, max: 300 }),
      tags: faker.helpers.arrayElements(['workshop', 'competition', 'lecture', 'festival', 'seminar'], { min: 1, max: 2 }),
      status: faker.helpers.arrayElement(['upcoming', 'ongoing'] as const),
      createdAt: faker.date.recent()
    }));

    setEvents(mockEvents.sort((a, b) => a.date.getTime() - b.date.getTime()));
  }, []);

  const firstDayOfMonth = startOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: endOfMonth(currentDate)
  });
  const startingDayIndex = getDay(firstDayOfMonth, { locale: enGB });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
          <p className="text-gray-400">Discover and manage university events</p>
        </motion.div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-400'
              }`}
            >
              <Grid size={18} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'calendar' ? 'bg-gray-700 shadow-sm text-white' : 'text-gray-400'
              }`}
            >
              <Calendar size={18} />
              <span>Calendar</span>
            </button>
          </div>

          <Link to="/create-event" className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-200">
            <Plus size={18} />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard event={event} variant="grid" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800 rounded-2xl shadow-lg shadow-black/20 border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy', { locale: enGB })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-primary-300 bg-primary-500/20 rounded-lg hover:bg-primary-500/30 transition-all duration-200"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} className="border-t border-gray-700"></div>
            ))}
            {daysInMonth.map(day => {
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border-t border-gray-700 ${
                    isToday ? 'bg-primary-500/10' : ''
                  } transition-colors duration-200`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-primary-300' : 'text-gray-300'
                  }`}>
                    {format(day, 'd', { locale: enGB })}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-primary-500/30 text-primary-200 rounded truncate"
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EventsPage;
