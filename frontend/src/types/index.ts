export interface User {
  id: number;
  username: string;
  role: 'STUDENT' | 'ADMIN' | 'FACULTY';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  availableCopies: number;
  coverImg: string;
}

export interface QueueRequest {
  id: number;
  userId: number;
  bookId: number;
  status: 'QUEUED' | 'ISSUED' | 'RETURNED' | 'REJECTED';
  requestTime: number;
  priority: number;
  bookTitle: string;
  username: string;
}

export interface Analytics {
  avgWaitTimeMinutes: number;
  busiestHour: string;
  totalIssued: { c: number };
  totalQueued: { c: number };
  totalReturned: { c: number };
  totalBooks: { c: number };
  recentActivity: ActivityItem[];
  hourlyData: HourlyData[];
  popularBooks: PopularBook[];
}

export interface ActivityItem {
  id: number;
  action: string;
  bookTitle: string;
  username: string;
  timestamp: number;
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface PopularBook {
  title: string;
  requestCount: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: number;
  read: boolean;
}
