import express from 'express';
import path from 'path';
import db from './db.js';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
  const { secret } = req.body;
  if (!secret || secret.length > 500) {
    return res.send('Secret is required and must be under 500 characters.');
  }

  db.run('INSERT INTO secrets (content) VALUES (?)', [secret], err => {
    if (err) return res.status(500).send('Error saving secret.');
    res.redirect('/secrets');
  });
});

app.get('/secrets', (req, res) => {
  db.all('SELECT * FROM secrets ORDER BY created_at DESC LIMIT 20', (err, rows) => {
    if (err) return res.status(500).send('Error fetching secrets.');
    res.render('secrets', { secrets: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:\${PORT}\ `);
});