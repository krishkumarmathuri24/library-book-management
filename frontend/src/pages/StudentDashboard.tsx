import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { estimateWaitTime } from '../lib/utils';
import type { QueueRequest, Book } from '../types';
import { BookOpen, Clock, List, TrendingUp, ArrowRight, BookMarked, Layers } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { queue, isConnected } = useSocket();
  const [myRequests, setMyRequests] = useState<QueueRequest[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, bookRes] = await Promise.all([
        api.get('/requests/me'),
        api.get('/books'),
      ]);
      setMyRequests(reqRes.data);
      setBooks(bookRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const myQueueItems = queue.filter(q => q.userId === user?.id);
  const myPosition = queue.findIndex(q => q.userId === user?.id) + 1;
  const activeRequests = myRequests.filter(r => r.status === 'QUEUED');
  const issuedBooks = myRequests.filter(r => r.status === 'ISSUED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Great to see you, {user?.username}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your library account
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myPosition || '—'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Queue Position</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myPosition > 0 ? estimateWaitTime(myPosition - 1) : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Est. Wait Time</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{issuedBooks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Books Issued</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <List className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeRequests.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Requests</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                Your Queue Status
              </h2>
              <Link to="/queue">
                <Button variant="ghost" size="sm">
                  View Full Queue <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {myQueueItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📚</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No active queue requests</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">
                  Browse our catalog to request books
                </p>
                <Link to="/catalog">
                  <Button size="sm">
                    <BookOpen className="w-4 h-4" /> Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myQueueItems.map((item) => {
                  const position = queue.findIndex(q => q.id === item.id) + 1;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                        #{position}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">📖 {item.bookTitle}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Estimated wait: {estimateWaitTime(position - 1)}
                        </p>
                      </div>
                      <Badge variant="info" pulse>In Queue</Badge>
                    </div>
                  );
                })}
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
              <Link to="/catalog" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 hover:from-primary-500/20 hover:to-accent-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Browse Books</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{books.length} books available</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <Link to="/queue" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">View Queue</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{queue.length} in queue</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <Link to="/my-requests" className="block">
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">My Requests</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{myRequests.length} total requests</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 mt-6">
            <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            {myRequests.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      req.status === 'QUEUED' ? 'bg-blue-500' :
                      req.status === 'ISSUED' ? 'bg-emerald-500' :
                      req.status === 'RETURNED' ? 'bg-gray-400' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-gray-900 dark:text-white">{req.bookTitle}</p>
                    </div>
                    <Badge
                      variant={
                        req.status === 'QUEUED' ? 'info' :
                        req.status === 'ISSUED' ? 'success' :
                        req.status === 'RETURNED' ? 'default' : 'danger'
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
