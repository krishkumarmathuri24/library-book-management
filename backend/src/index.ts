import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { run, get, all, initDb } from './database';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const JWT_SECRET = 'your-library-secret';

// Init DB
initDb().then(() => console.log('Database initialized'));

const emitQueueUpdate = async () => {
  const queued = await all(`
    SELECT r.id, r.userId, r.bookId, r.status, r.requestTime, r.priority, b.title as bookTitle, u.username 
    FROM requests r
    JOIN books b ON r.bookId = b.id
    JOIN users u ON r.userId = u.id
    WHERE r.status = 'QUEUED'
    ORDER BY r.priority DESC, r.requestTime ASC
  `);
  io.emit('queue-update', queued);
};

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send immediate update
  emitQueueUpdate();
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

function authenticate(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Valid token required' });
    req.user = user;
    next();
  });
}

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role || 'STUDENT']);
    res.json({ message: 'User created' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await get<any>('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return res.status(401).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Books Routes
app.get('/api/books', async (req, res) => {
  const books = await all('SELECT * FROM books');
  res.json(books);
});

// Queue Routes
app.get('/api/queue', authenticate, async (req, res) => {
  const queued = await all(`
    SELECT r.id, r.userId, r.bookId, r.status, r.requestTime, r.priority, b.title as bookTitle, u.username 
    FROM requests r
    JOIN books b ON r.bookId = b.id
    JOIN users u ON r.userId = u.id
    WHERE r.status = 'QUEUED'
    ORDER BY r.priority DESC, r.requestTime ASC
  `);
  res.json(queued);
});

// Request Book (Queue System)
app.post('/api/requests', authenticate, async (req: any, res: any) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;
  const priority = userRole === 'FACULTY' || userRole === 'ADMIN' ? 1 : 0; // priority scheduling
  
  // Check if book exists
  const book = await get<any>('SELECT * FROM books WHERE id = ?', [bookId]);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  await run('INSERT INTO requests (userId, bookId, status, requestTime, priority) VALUES (?, ?, ?, ?, ?)', 
    [userId, bookId, 'QUEUED', Date.now(), priority]);
  
  emitQueueUpdate();
  res.json({ message: 'Request added to queue' });
});

app.get('/api/requests/me', authenticate, async (req: any, res: any) => {
  const myRequests = await all(`
    SELECT r.id, r.userId, r.bookId, r.status, r.requestTime, r.priority, b.title as bookTitle 
    FROM requests r
    JOIN books b ON r.bookId = b.id
    WHERE r.userId = ?
    ORDER BY r.requestTime DESC
  `, [req.user.id]);
  res.json(myRequests);
});

// Admin Route to handle Request (Issue Book)
app.post('/api/requests/:id/issue', authenticate, async (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });
  const reqId = req.params.id;

  const request = await get<any>('SELECT * FROM requests WHERE id = ?', [reqId]);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  if (request.status !== 'QUEUED') return res.status(400).json({ error: 'Request is not in queue' });

  // Update book copies
  const book = await get<any>('SELECT * FROM books WHERE id = ?', [request.bookId]);
  if (book.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });

  await run('UPDATE books SET availableCopies = availableCopies - 1 WHERE id = ?', [request.bookId]);
  await run('UPDATE requests SET status = ? WHERE id = ?', ['ISSUED', reqId]);
  
  emitQueueUpdate();
  res.json({ message: 'Book issued successfully' });
});

// Admin Route to handle Returned Book
app.post('/api/requests/:id/return', authenticate, async (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });
  const reqId = req.params.id;

  const request = await get<any>('SELECT * FROM requests WHERE id = ?', [reqId]);
  if (!request || request.status !== 'ISSUED') return res.status(400).json({ error: 'Invalid operation' });

  await run('UPDATE books SET availableCopies = availableCopies + 1 WHERE id = ?', [request.bookId]);
  await run('UPDATE requests SET status = ? WHERE id = ?', ['RETURNED', reqId]);
  
  emitQueueUpdate();
  res.json({ message: 'Book returned successfully' });
});

// Analytics Dashboard
app.get('/api/analytics', authenticate, async (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });

  // Average Wait time for ISSUED books can be calculated if we tracked issueTime. 
  // For MVP, we'll return mock stats just to show the UI
  res.json({
    avgWaitTimeMinutes: 14.5,
    busiestHour: '10:00 AM',
    totalIssued: await get('SELECT COUNT(*) as c FROM requests WHERE status = "ISSUED"'),
    totalQueued: await get('SELECT COUNT(*) as c FROM requests WHERE status = "QUEUED"'),
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
