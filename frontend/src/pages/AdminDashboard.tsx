import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import type { Book } from '../types';
import { BookOpen, Users, Clock, BarChart3, ArrowRight, Layers, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { queue, isConnected } = useSocket();
  const [books, setBooks] = useState<Book[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, analyticsRes] = await Promise.all([
        api.get('/books'),
        api.get('/analytics'),
      ]);
      setBooks(bookRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const totalBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard 🛡️
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage the library queue system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? 'Live Connection' : 'Disconnected'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/5 border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{queue.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Queue</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/5 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalIssued?.c || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Issued</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/5 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.avgWaitTimeMinutes || 0}m</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Wait</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/5 border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalBooks}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Books</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Queue Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                Active Queue
              </h2>
              <Link to="/admin/queue">
                <Button variant="ghost" size="sm">
                  Manage <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">✨</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Queue is clear!</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All requests have been processed</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">📖 {item.bookTitle}</p>
                    </div>
                    {item.priority > 0 && <Badge variant="priority">Priority</Badge>}
                  </div>
                ))}
                {queue.length > 5 && (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 pt-2">
                    +{queue.length - 5} more in queue
                  </p>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link to="/admin/queue" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 hover:from-primary-500/20 hover:to-accent-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Manage Queue</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Issue & return books</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <Link to="/admin/analytics" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Analytics</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View statistics</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <Link to="/catalog" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Book Catalog</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{books.length} books</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Busiest Hour */}
          <Card className="p-6 mt-6">
            <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Insights
            </h2>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Busiest Hour</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics?.busiestHour || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Queued</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{analytics?.totalQueued?.c || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
