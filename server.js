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

// Home page with form
app.get('/', (req, res) => {
  res.render('index');
});

// Handle secret submission
app.post('/submit', (req, res) => {
  const { secret } = req.body;
  if (!secret || secret.length > 10000) {
    return res.send('Secret is required and must be under 10000 characters.');
  }

  try {
    db.prepare('INSERT INTO secrets (content) VALUES (?)').run(secret);
    res.redirect('/secrets');
  } catch (err) {
    console.error('Error saving secret:', err);
    res.status(500).send('Failed to save secret.');
  }
});

// Display stored secrets
app.get('/secrets', (req, res) => {
  try {
    const secrets = db.prepare('SELECT * FROM secrets ORDER BY created_at DESC LIMIT 20').all();
    res.render('secrets', { secrets });
  } catch (err) {
    console.error('Error retrieving secrets:', err);
    res.status(500).send('Failed to load secrets.');
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Leaf Sheep Secret Keeper running at http://localhost:${PORT}`);
});
