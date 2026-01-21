import express from 'express';
import path from 'path';
import db from './db.js';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

/* ======================
   Middleware
====================== */

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ REQUIRED for drawings
app.use(express.static(path.join(__dirname, 'public')));

/* ======================
   Pages
====================== */

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Drawing page
app.get('/draw', (req, res) => {
  res.render('draw');
});

// Gallery page
app.get('/gallery', (req, res) => {
  const drawings = db
    .prepare('SELECT * FROM drawings ORDER BY created_at DESC')
    .all();

  res.render('gallery', { drawings });
});

// Secrets page
app.get('/secrets', (req, res) => {
  const secrets = db
    .prepare('SELECT * FROM secrets ORDER BY created_at DESC LIMIT 20')
    .all();

  res.render('secrets', { secrets });
});

/* ======================
   Actions
====================== */

// Save secret
app.post('/submit', (req, res) => {
  const { secret } = req.body;

  if (!secret || secret.length > 10000) {
    return res.status(400).send('Invalid secret.');
  }

  db.prepare(
    'INSERT INTO secrets (content) VALUES (?)'
  ).run(secret);

  res.redirect('/secrets');
});

// Save drawing
app.post('/drawings', (req, res) => {
  const { image } = req.body;

  if (!image || !image.startsWith('data:image')) {
    return res.status(400).send('Invalid image data');
  }

  db.prepare(
    'INSERT INTO drawings (image) VALUES (?)'
  ).run(image);

  res.sendStatus(200);
});

/* ======================
   Server
====================== */

app.listen(PORT, () => {
  console.log(`🐑 Leaf Sheep running at http://localhost:${PORT}`);
  console.log(`🔐 Leaf Sheep Secret Keeper running at http://localhost:${PORT}`);
});
