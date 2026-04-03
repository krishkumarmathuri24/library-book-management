import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./library.sqlite');

export const run = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

export const get = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row as T);
    });
  });
};

export const all = <T>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows as T[]);
    });
  });
};

export const initDb = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'STUDENT'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      availableCopies INTEGER,
      coverImg TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      bookId INTEGER,
      status TEXT, -- 'QUEUED', 'ISSUED', 'RETURNED', 'REJECTED'
      requestTime INTEGER,
      priority INTEGER DEFAULT 0, -- 1 for high priority (faculty)
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(bookId) REFERENCES books(id)
    )
  `);

  // Seed sample data
  const userCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if (userCount?.count === 0) {
    const bcrypt = require('bcryptjs');
    const adminHash = await bcrypt.hash('admin123', 10);
    const studentHash = await bcrypt.hash('student1', 10);
    const student2Hash = await bcrypt.hash('student2', 10);
    const student3Hash = await bcrypt.hash('student3', 10);
    const facultyHash = await bcrypt.hash('faculty1', 10);
    
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', adminHash, 'ADMIN']);
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['student1', studentHash, 'STUDENT']);
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['rahul_k', student2Hash, 'STUDENT']);
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['priya_s', student3Hash, 'STUDENT']);
    await run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['dr_sharma', facultyHash, 'FACULTY']);

    // More books with diverse covers
    const books = [
      ['The Art of Scalability', 'Martin L. Abbott', 3, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'],
      ['Clean Code', 'Robert C. Martin', 2, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'],
      ['Designing Data-Intensive Applications', 'Martin Kleppmann', 5, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400'],
      ['Introduction to Algorithms', 'Thomas H. Cormen', 3, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400'],
      ['The Pragmatic Programmer', 'David Thomas', 4, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400'],
      ['Design Patterns', 'Erich Gamma', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'],
      ['Artificial Intelligence: A Modern Approach', 'Stuart Russell', 3, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400'],
      ['Database System Concepts', 'Abraham Silberschatz', 4, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400'],
      ['Operating System Concepts', 'Abraham Silberschatz', 3, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400'],
      ['Computer Networking', 'James Kurose', 2, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400'],
      ['Structure and Interpretation of Computer Programs', 'Harold Abelson', 1, 'https://images.unsplash.com/photo-1510172951991-856a62f5e1b3?auto=format&fit=crop&q=80&w=400'],
      ['Cracking the Coding Interview', 'Gayle L. McDowell', 5, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400'],
    ];

    for (const [title, author, copies, img] of books) {
      await run('INSERT INTO books (title, author, availableCopies, coverImg) VALUES (?, ?, ?, ?)', [title, author, copies, img]);
    }

    // Seed some sample queue requests for demo
    const now = Date.now();
    await run('INSERT INTO requests (userId, bookId, status, requestTime, priority) VALUES (?, ?, ?, ?, ?)',
      [2, 1, 'QUEUED', now - 300000, 0]); // student1, 5 min ago
    await run('INSERT INTO requests (userId, bookId, status, requestTime, priority) VALUES (?, ?, ?, ?, ?)',
      [3, 2, 'QUEUED', now - 180000, 0]); // rahul_k, 3 min ago
    await run('INSERT INTO requests (userId, bookId, status, requestTime, priority) VALUES (?, ?, ?, ?, ?)',
      [5, 3, 'QUEUED', now - 120000, 1]); // dr_sharma (faculty - priority), 2 min ago
    await run('INSERT INTO requests (userId, bookId, status, requestTime, priority) VALUES (?, ?, ?, ?, ?)',
      [4, 1, 'QUEUED', now - 60000, 0]);  // priya_s, 1 min ago
  }
};
