import { useState, useEffect } from 'react';
import type { Book } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { BookOpen, User, RotateCcw, Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRequest?: (bookId: number) => void;
  onReturn?: (requestId: number) => void;
  isRequesting?: boolean;
  isReturning?: boolean;
  issuedRequestId?: number;
  queuedRequest?: {
    requestTime: number;
    position: number;
  };
  showRequest?: boolean;
}

export default function BookCard({ 
  book, 
  onRequest, 
  onReturn,
  isRequesting, 
  isReturning,
  issuedRequestId,
  queuedRequest,
  showRequest = true 
}: BookCardProps) {
  const isAvailable = book.availableCopies > 0;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!queuedRequest) {
      setTimeLeft(null);
      return;
    }
    
    // The required target time to pass the 1-minute-per-position rule
    const targetTime = queuedRequest.requestTime + (queuedRequest.position * 60000);
    
    const update = () => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeft(remaining);
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [queuedRequest]);

  return (
    <Card hover className="overflow-hidden group flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={book.coverImg}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={isAvailable ? 'success' : 'danger'}>
            {isAvailable ? `${book.availableCopies} available` : 'Unavailable'}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg line-clamp-2 mb-1">
          {book.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <User className="w-3.5 h-3.5" />
          {book.author}
        </div>

        {showRequest && issuedRequestId ? (
          <Button
            variant="success"
            size="sm"
            className="w-full mt-auto"
            isLoading={isReturning}
            onClick={() => onReturn?.(issuedRequestId)}
          >
            <RotateCcw className="w-4 h-4" />
            Return Book
          </Button>
        ) : showRequest && queuedRequest ? (
          <div className="w-full mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ETA</span>
              <span>{timeLeft !== null && timeLeft > 0 ? `${Math.ceil(timeLeft / 1000)}s` : 'Issuing...'}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={true}
            >
              <BookOpen className="w-4 h-4" />
              Requested (Pos {queuedRequest.position})
            </Button>
          </div>
        ) : showRequest && (
          <Button
            variant={isAvailable ? 'primary' : 'secondary'}
            size="sm"
            className="w-full mt-auto"
            disabled={!isAvailable || isRequesting}
            isLoading={isRequesting}
            onClick={() => onRequest?.(book.id)}
          >
            <BookOpen className="w-4 h-4" />
            {isAvailable ? 'Request Book' : 'Join Waitlist'}
          </Button>
        )}
      </div>
    </Card>
  );
}
