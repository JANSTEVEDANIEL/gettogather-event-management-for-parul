import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Activity, BarChart3, PlusCircle, Settings } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  activeEvents: number;
  totalAttendees: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalUsers: 0,
    activeEvents: 0,
    totalAttendees: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalEvents: faker.number.int({ min: 150, max: 300 }),
        totalUsers: faker.number.int({ min: 2000, max: 5000 }),
        activeEvents: faker.number.int({ min: 15, max: 45 }),
        totalAttendees: faker.number.int({ min: 10000, max: 25000 })
      });
    }, 500);
  }, []);

  const recentActivities = Array.from({ length: 8 }, () => ({
    id: faker.string.uuid(),
    user: faker.person.fullName(),
    action: faker.helpers.arrayElement([
      'created a new event',
      'joined an event',
      'cancelled an event',
      'updated event details',
      'shared an event'
    ]),
    event: faker.helpers.arrayElement([
      'Tech Fest 2025',
      'Cultural Night',
      'Sports Day',
      'Career Fair',
      'Workshop Series'
    ]),
    time: faker.date.recent()
  }));

  const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: number;
    change: string;
    color: string;
  }> = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">
        {value.toLocaleString('en-GB')}
      </h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor and manage university events</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Total Events"
          value={stats.totalEvents}
          change="+12%"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          title="Registered Users"
          value={stats.totalUsers}
          change="+8%"
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          icon={Activity}
          title="Active Events"
          value={stats.activeEvents}
          change="+15%"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Attendees"
          value={stats.totalAttendees}
          change="+23%"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Event Analytics</h2>
              <button className="flex items-center space-x-2 text-primary-400 hover:text-primary-300">
                <BarChart3 size={18} />
                <span>View Details</span>
              </button>
            </div>
            
            <div className="h-64 bg-gradient-to-br from-gray-700/50 to-gray-700/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto text-primary-400 mb-4" size={48} />
                <p className="text-gray-400">Analytics Chart Placeholder</p>
                <p className="text-sm text-gray-500 mt-2">
                  Connect to your analytics service to see detailed insights
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Activity size={18} className="text-gray-400" />
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-300 text-sm font-medium">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium text-primary-400">"{activity.event}"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time.toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <PlusCircle size={24} />
          </div>
          <p className="text-primary-200 mb-4">Create and manage events efficiently</p>
          <button className="bg-white/90 text-primary-600 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200 font-medium">
            Create Event
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">User Management</h3>
            <Users className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-400 mb-4">Manage user roles and permissions</p>
          <button className="text-primary-400 hover:text-primary-300 font-medium">
            View Users →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-black/20 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Settings</h3>
            <Settings className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-400 mb-4">Configure platform settings</p>
          <button className="text-primary-400 hover:text-primary-300 font-medium">
            Open Settings →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
