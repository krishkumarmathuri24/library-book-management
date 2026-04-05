import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import BookCard from '../components/shared/BookCard';
import Input from '../components/ui/Input';
import type { Book } from '../types';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [requestingId, setRequestingId] = useState<number | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const [{ data: booksData }, { data: reqData }] = await Promise.all([
        api.get('/books'),
        api.get('/requests/me')
      ]);
      setBooks(booksData);
      setMyRequests(reqData);
    } catch (err) {
      toast.error('Failed to load books');
    }
  };

  const handleRequest = async (bookId: number) => {
    setRequestingId(bookId);
    try {
      await api.post('/requests', { bookId });
      toast.success('Book request added to queue! 🎉');
      fetchBooks(); // Refresh availability
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to request book');
    } finally {
      setRequestingId(null);
    }
  };

  const handleReturn = async (requestId: number) => {
    setReturningId(requestId);
    try {
      await api.post(`/requests/${requestId}/return`);
      toast.success('Book returned successfully! 📚');
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                          (filter === 'available' && book.availableCopies > 0) ||
                          (filter === 'unavailable' && book.availableCopies === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Book Catalog 📚
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse our collection and request books to join the queue
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex-1">
          <Input
            id="book-search"
            placeholder="Search books by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'available', 'unavailable'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No books found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <BookCard
                book={book}
                onRequest={handleRequest}
                onReturn={handleReturn}
                isRequesting={requestingId === book.id}
                issuedRequestId={myRequests.find(r => r.bookId === book.id && r.status === 'ISSUED')?.id}
                isReturning={returningId === myRequests.find(r => r.bookId === book.id && r.status === 'ISSUED')?.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <div className="bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 rounded-2xl p-8 border border-primary-500/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white">AI Recommendations</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Based on popular borrowing patterns</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.slice(0, 4).map(book => (
              <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-slate-700/50">
                <img src={book.coverImg} alt={book.title} className="w-12 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                  <p className="text-xs text-primary-500 mt-0.5">📈 Frequently borrowed together</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
