import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import QRCodeModal from '../components/shared/QRCodeModal';
import type { QueueRequest } from '../types';
import { formatTimeAgo } from '../lib/utils';
import { QrCode, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState<QueueRequest[]>([]);
  const [qrModal, setQrModal] = useState<{ open: boolean; data: string; title: string }>({
    open: false,
    data: '',
    title: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests/me');
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'QUEUED':
        return { variant: 'info' as const, icon: Clock, label: 'In Queue', color: 'text-blue-500' };
      case 'ISSUED':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Issued', color: 'text-emerald-500' };
      case 'RETURNED':
        return { variant: 'default' as const, icon: RotateCcw, label: 'Returned', color: 'text-gray-500' };
      case 'REJECTED':
        return { variant: 'danger' as const, icon: XCircle, label: 'Rejected', color: 'text-red-500' };
      default:
        return { variant: 'default' as const, icon: Clock, label: status, color: 'text-gray-500' };
    }
  };

  const queued = requests.filter(r => r.status === 'QUEUED');
  const issued = requests.filter(r => r.status === 'ISSUED');
  const history = requests.filter(r => r.status === 'RETURNED' || r.status === 'REJECTED');

  const renderSection = (title: string, items: QueueRequest[], emoji: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span>{emoji}</span> {title}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No {title.toLowerCase()} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((req) => {
            const config = getStatusConfig(req.status);
            const Icon = config.icon;
            return (
              <Card key={req.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      📖 {req.bookTitle}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Requested {formatTimeAgo(req.requestTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    {req.status === 'QUEUED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQrModal({
                          open: true,
                          data: `LIBQUEUE-REQ-${req.id}`,
                          title: `Request: ${req.bookTitle}`,
                        })}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Requests 📋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track all your book requests and their current status
        </p>
      </motion.div>

      <div className="space-y-8">
        {renderSection('In Queue', queued, '⏳')}
        {renderSection('Currently Issued', issued, '📗')}
        {renderSection('History', history, '📜')}
      </div>

      <QRCodeModal
        isOpen={qrModal.open}
        onClose={() => setQrModal({ ...qrModal, open: false })}
        data={qrModal.data}
        title={qrModal.title}
      />
    </div>
  );
}
