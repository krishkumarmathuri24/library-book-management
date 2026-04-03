import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';
import { getAvatarColor, getInitials, estimateWaitTime } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Zap, Trophy, ArrowRight } from 'lucide-react';

export default function QueueVisualization() {
  const { queue } = useSocket();
  const { user } = useAuth();

  const myPosition = queue.findIndex(q => q.userId === user?.id) + 1;
  const totalInQueue = queue.length;

  return (
    <div className="space-y-6">
      {/* Queue Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5 rounded-2xl p-4 border border-primary-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">In Queue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInQueue}</p>
        </div>
        
        {myPosition > 0 && (
          <div className="bg-gradient-to-br from-accent-500/10 to-accent-500/5 dark:from-accent-500/20 dark:to-accent-500/5 rounded-2xl p-4 border border-accent-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-medium text-accent-600 dark:text-accent-400">Your Position</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">#{myPosition}</p>
          </div>
        )}
        
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Est. Wait</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {myPosition > 0 ? estimateWaitTime(myPosition - 1) : totalInQueue > 0 ? estimateWaitTime(totalInQueue) : '0 min'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5 rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Avg Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">~5 min</p>
        </div>
      </div>

      {/* Progress Track */}
      {myPosition > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Your Progress</h3>
          <div className="relative">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-emerald-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(5, ((totalInQueue - myPosition + 1) / totalInQueue) * 100)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Joined Queue</span>
              <span className="font-medium text-primary-500">Position #{myPosition}</span>
              <span>Book Issued! 🎉</span>
            </div>
          </div>
        </div>
      )}

      {/* Gamified Queue Line */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Queue Line</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Priority
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500" /> Normal
            </span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Queue is empty</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No pending requests right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {queue.map((item, index) => {
                const isMe = item.userId === user?.id;
                const gradientClass = getAvatarColor(item.username);
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isMe
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500 shadow-lg shadow-primary-500/10'
                        : 'bg-gray-50 dark:bg-slate-700/50 border border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Position */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      index === 0 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                        : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-sm font-bold shadow-md ${
                      isMe ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-800' : ''
                    }`}>
                      {getInitials(item.username)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium truncate ${isMe ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                          {item.username}
                          {isMe && <span className="ml-1 text-xs">(You)</span>}
                        </p>
                        {item.priority > 0 && (
                          <Badge variant="priority">
                            <Zap className="w-3 h-3" /> Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        📖 {item.bookTitle}
                      </p>
                    </div>

                    {/* Wait time */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400 dark:text-gray-500">Wait</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {estimateWaitTime(index)}
                      </p>
                    </div>

                    {/* Arrow indicator for first */}
                    {index === 0 && (
                      <div className="flex items-center">
                        <ArrowRight className="w-5 h-5 text-emerald-500 animate-bounce-subtle" />
                        <span className="text-xs font-medium text-emerald-500 ml-1">Next</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
