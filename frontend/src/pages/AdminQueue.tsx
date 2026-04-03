import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import QRCodeModal from '../components/shared/QRCodeModal';
import { formatTimeAgo, getAvatarColor, getInitials } from '../lib/utils';

import { Search, BookCheck, QrCode, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminQueue() {
  const { queue } = useSocket();
  const [search, setSearch] = useState('');
  const [issuingId, setIssuingId] = useState<number | null>(null);

  const [qrModal, setQrModal] = useState<{ open: boolean; data: string; title: string }>({
    open: false, data: '', title: '',
  });



  const handleIssue = async (requestId: number) => {
    setIssuingId(requestId);
    try {
      await api.post(`/requests/${requestId}/issue`);
      toast.success('Book issued successfully! 📗');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to issue book');
    } finally {
      setIssuingId(null);
    }
  };



  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.username.toLowerCase().includes(search.toLowerCase()) ||
                          item.bookTitle.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Queue Management 📋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Issue books, manage returns, and process the queue
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800 text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{queue.length}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Pending</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800 text-center">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{queue.filter(q => q.priority > 0).length}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Priority</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 text-center">
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{queue.length > 0 ? 1 : 0}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Ready to Issue</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Input
          id="queue-search"
          placeholder="Search by student name or book title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </motion.div>

      {/* Queue Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">✨</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Queue is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All book requests have been processed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Student</div>
                <div className="col-span-3">Book</div>
                <div className="col-span-2">Requested</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Table Rows */}
              {filteredQueue.map((item, index) => {
                const gradientClass = getAvatarColor(item.username);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors items-center"
                  >
                    {/* Position */}
                    <div className="col-span-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Student */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs font-bold`}>
                        {getInitials(item.username)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{item.username}</span>
                    </div>

                    {/* Book */}
                    <div className="col-span-3">
                      <p className="text-sm text-gray-900 dark:text-white truncate">📖 {item.bookTitle}</p>
                    </div>

                    {/* Requested */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(item.requestTime)}</p>
                    </div>

                    {/* Priority */}
                    <div className="col-span-1">
                      {item.priority > 0 ? (
                        <Badge variant="priority"><Zap className="w-3 h-3" /> High</Badge>
                      ) : (
                        <Badge variant="default">Normal</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleIssue(item.id)}
                        isLoading={issuingId === item.id}
                      >
                        <BookCheck className="w-4 h-4" />
                        <span className="hidden lg:inline">Issue</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQrModal({
                          open: true,
                          data: `LIBQUEUE-ISSUE-${item.id}-${item.bookId}-${item.userId}`,
                          title: `Issue: ${item.bookTitle}`,
                        })}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      <QRCodeModal
        isOpen={qrModal.open}
        onClose={() => setQrModal({ ...qrModal, open: false })}
        data={qrModal.data}
        title={qrModal.title}
      />
    </div>
  );
}
