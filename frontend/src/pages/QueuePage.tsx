import { motion } from 'framer-motion';
import QueueVisualization from '../components/queue/QueueVisualization';

export default function QueuePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Live Queue 🚀
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time FIFO queue visualization with priority scheduling
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QueueVisualization />
      </motion.div>

      {/* Algorithm Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700"
      >
        <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-4">
          📐 Queue Scheduling Algorithm
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary-500">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">FIFO (First In, First Out)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Requests are processed in the order they arrive, ensuring fairness for all students.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-amber-500">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Priority Queue</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Faculty and urgent requests get elevated priority, processed before normal queue items.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-emerald-500">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Real-time Updates</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">WebSocket connection pushes instant updates when queue changes, no manual refresh needed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-violet-500">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Estimated Wait Time</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average service time per request is calculated to provide accurate wait estimates.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
