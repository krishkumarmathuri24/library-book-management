import 'dotenv/config';
import { all, initDb } from './src/database';

async function checkDatabase() {
  try {
    await initDb();
    
    console.log('--- ALL USERS ---');
    const users = await all('SELECT id, username, role FROM users');
    console.table(users);
    
    console.log('\n--- ALL BOOKS ---');
    const books = await all('SELECT id, title, available_copies as "availableCopies" FROM books');
    console.table(books);
    
    console.log('\n--- ALL REQUESTS (ACTIVE/HISTORY) ---');
    const requests = await all('SELECT id, user_id as "userId", book_id as "bookId", status, priority FROM requests');
    console.table(requests);
    
  } catch (error) {
    console.error('Error reading database:', error);
  }
}

checkDatabase();
