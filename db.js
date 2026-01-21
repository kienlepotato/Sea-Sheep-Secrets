import Database from 'better-sqlite3';

const db = new Database('secrets.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS secrets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )

  
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

  
`);
export default db;