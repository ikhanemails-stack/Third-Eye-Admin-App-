// Third Eye Computer Solutions - License Manager
// Main server entry point.

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const { seed } = require('./seed');
const { requireLogin } = require('./helpers');

seed();

const app = express();
const PORT = process.env.PORT || 5190;

app.use(bodyParser.json({ limit: '5mb' }));

// The public verify-license endpoint is called directly by customer POS
// installations running on different computers/networks, so it needs CORS
// headers open. (No npm 'cors' package needed - this is a few lines of
// plain Express middleware.)
app.use('/api/public', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use('/api', require('./routes/public'));

app.use(session({
  secret: 'third-eye-license-manager-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

app.use('/api', require('./routes/auth'));
app.use('/api', requireLogin, require('./routes/clients'));
app.use('/api', require('./routes/public'));

// Health check for Railway
app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get('/ping',   (req, res) => res.json({ ok: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  THIRD EYE COMPUTER SOLUTIONS');
  console.log('  License Manager is running');
  console.log(`  Open in your browser: http://localhost:${PORT}`);
  console.log('========================================');
});
