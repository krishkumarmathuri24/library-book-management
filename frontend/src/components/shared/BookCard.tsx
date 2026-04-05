import type { Book } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { BookOpen, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRequest?: (bookId: number) => void;
  isRequesting?: boolean;
  showRequest?: boolean;
}

export default function BookCard({ book, onRequest, isRequesting, showRequest = true }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

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

        {showRequest && (
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
