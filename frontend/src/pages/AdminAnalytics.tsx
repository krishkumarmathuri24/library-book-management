import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Card from '../components/ui/Card';
import { BarChart3, Clock, TrendingUp, BookOpen, Users, Activity } from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/analytics');
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  // Mock hourly data for the chart
  const hourlyData = [
    { hour: '8AM', value: 12 },
    { hour: '9AM', value: 25 },
    { hour: '10AM', value: 45 },
    { hour: '11AM', value: 38 },
    { hour: '12PM', value: 30 },
    { hour: '1PM', value: 20 },
    { hour: '2PM', value: 35 },
    { hour: '3PM', value: 42 },
    { hour: '4PM', value: 28 },
    { hour: '5PM', value: 15 },
    { hour: '6PM', value: 8 },
  ];

  const maxValue = Math.max(...hourlyData.map(d => d.value));

  // Mock popular books data
  const popularBooks = [
    { title: 'Clean Code', percentage: 85 },
    { title: 'Introduction to Algorithms', percentage: 72 },
    { title: 'The Art of Scalability', percentage: 65 },
    { title: 'Designing Data-Intensive Applications', percentage: 58 },
  ];

  // Mock weekly trend
  const weeklyTrend = [
    { day: 'Mon', requests: 22, issued: 18 },
    { day: 'Tue', requests: 28, issued: 25 },
    { day: 'Wed', requests: 35, issued: 30 },
    { day: 'Thu', requests: 30, issued: 28 },
    { day: 'Fri', requests: 40, issued: 35 },
    { day: 'Sat', requests: 15, issued: 12 },
    { day: 'Sun', requests: 8, issued: 6 },
  ];
  const maxWeekly = Math.max(...weeklyTrend.map(d => Math.max(d.requests, d.issued)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard 📊
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor library performance, usage patterns, and queue efficiency
        </p>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.avgWaitTimeMinutes || 0}m</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Wait Time</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.busiestHour || '—'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Busiest Hour</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalIssued?.c || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Books Issued</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalQueued?.c || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Requests</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Hourly Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              <h2 className="font-heading font-bold text-gray-900 dark:text-white">Hourly Traffic</h2>
            </div>
            <div className="flex items-end gap-2 h-48">
              {hourlyData.map((d, i) => (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full bg-gradient-to-t from-primary-500 to-accent-400 rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                    style={{ minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{d.hour}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Peak: {analytics?.busiestHour || '10:00 AM'}</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
                Requests per hour
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="font-heading font-bold text-gray-900 dark:text-white">Weekly Trend</h2>
            </div>
            <div className="flex items-end gap-3 h-48">
              {weeklyTrend.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
                    <motion.div
                      className="flex-1 bg-primary-500/70 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.requests / maxWeekly) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                      style={{ minHeight: '4px' }}
                    />
                    <motion.div
                      className="flex-1 bg-emerald-500/70 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.issued / maxWeekly) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                      style={{ minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                Requests
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Issued
              </span>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="font-heading font-bold text-gray-900 dark:text-white">Most Requested Books</h2>
            </div>
            <div className="space-y-4">
              {popularBooks.map((book, i) => (
                <div key={book.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <span className="text-xs text-gray-400">#{i + 1}</span>
                      {book.title}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{book.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                        i === 1 ? 'bg-gradient-to-r from-primary-400 to-primary-600' :
                        i === 2 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                        'bg-gradient-to-r from-violet-400 to-violet-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${book.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Queue Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-violet-500" />
              <h2 className="font-heading font-bold text-gray-900 dark:text-white">Queue Efficiency</h2>
            </div>
            <div className="space-y-6">
              {/* Donut Chart Approximation */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-slate-700" />
                    <motion.circle
                      cx="60" cy="60" r="50" fill="none" stroke="url(#gradient)" strokeWidth="12"
                      strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.87) }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">87%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Efficiency</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">94%</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Fulfillment Rate</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 text-center">
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">4.2m</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Avg Processing</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
