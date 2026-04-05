-- SQL for Supabase SQL Editor
-- Run this script in your Supabase project's SQL Editor!

-- 1. Create USERS table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create BOOKS table
CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  available_copies INTEGER DEFAULT 1,
  cover_img TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create REQUESTS table
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  book_id BIGINT REFERENCES books(id),
  status TEXT DEFAULT 'QUEUED', -- 'QUEUED', 'ISSUED', 'RETURNED', 'REJECTED'
  request_time BIGINT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Seed initial data
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$R6vUrNcQ7Xc/BdbTqDn8Wee4/HKgqyw.J33kJg96ybGGM22IFO8yG', 'ADMIN'),
('krishmathuri24', '$2b$10$BJ51tkhCrkae1iAcehY9/uTLieAIB2ZUKx1nvXvXqdSe0P0gJGy0W', 'STUDENT'),
('krishmathuri', '$2b$10$90ba9knEEKCwKiR8VghkO.PuiLbbhAKRmJ/MZ0AeNy/JoL5W92y6O', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

INSERT INTO books (title, author, available_copies, cover_img) VALUES 
('The Art of Scalability', 'Martin L. Abbott', 3, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'),
('Clean Code', 'Robert C. Martin', 2, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 5, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400')
ON CONFLICT DO NOTHING;
