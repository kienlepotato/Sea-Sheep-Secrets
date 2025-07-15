import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./secrets.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS secrets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
