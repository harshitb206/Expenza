const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  // Expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    merchant TEXT,
    category TEXT,
    date TEXT,
    notes TEXT
  )`);

  // Income table
  db.run(`CREATE TABLE IF NOT EXISTS income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    date TEXT
  )`);

  // === Table for dynamic keyword-category mapping ===
  db.run(`CREATE TABLE IF NOT EXISTS keyword_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT UNIQUE,
    category TEXT
  )`);
  
  // === New table for dynamic ML training data (The Feedback Loop) ===
  db.run(`CREATE TABLE IF NOT EXISTS ml_training_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT UNIQUE,
    category TEXT
  )`);
  
  // === Bootstrap initial data for keyword_categories ===
  // This data ensures that known merchants are always correctly categorized instantly.
  const initialData = [
      { keyword: 'pizza', category: 'Food' },
      { keyword: 'burger', category: 'Food' },
      { keyword: 'kfc', category: 'Food' },
      { keyword: 'dominos', category: 'Food' },
      { keyword: 'starbucks', category: 'Food' },
      { keyword: 'uber', category: 'Travel' },
      { keyword: 'ola', category: 'Travel' },
      { keyword: 'bus', category: 'Travel' },
      { keyword: 'train', category: 'Travel' },
      { keyword: 'cab', category: 'Travel' },
      { keyword: 'salary', category: 'Income' },
      { keyword: 'bonus', category: 'Income' },
      { keyword: 'freelance', category: 'Income' },
      { keyword: 'rent', category: 'Rent' },
      { keyword: 'apartment', category: 'Rent' },
      { keyword: 'house', category: 'Rent' },
      { keyword: 'movie', category: 'Entertainment' },
      { keyword: 'netflix', category: 'Entertainment' },
      { keyword: 'concert', category: 'Entertainment' },
      // Add a few keywords for the new consolidated categories
      { keyword: 'tuition', category: 'Education/Childcare' },
      { keyword: 'daycare', category: 'Education/Childcare' },
      { keyword: 'amazon', category: 'Shopping' },
      { keyword: 'safeway', category: 'Shopping' },
      { keyword: 'insurance', category: 'Finance' },
      { keyword: 'loan', category: 'Finance' },
      { keyword: 'doctor', category: 'Health' },
      { keyword: 'gym', category: 'Fitness' },
      { keyword: 'pet', category: 'Pets' },

      
  ];

  // Use INSERT OR IGNORE to prevent duplicate keywords being added on subsequent runs
  const stmt = db.prepare('INSERT OR IGNORE INTO keyword_categories (keyword, category) VALUES (?, ?)');
  initialData.forEach(data => {
    stmt.run(data.keyword.toLowerCase(), data.category);
  });
  stmt.finalize();
  // ======================================
});

module.exports = db;