// Third Eye Computer Solutions - License Manager
// Initializes default data on first run.

const db = require('./db');
const bcrypt = require('bcryptjs');

function seed() {
  db.ensureTable('admin_users', []);
  if (db.all('admin_users').length === 0) {
    db.insert('admin_users', {
      name: 'Third Eye Admin',
      username: 'admin',
      passwordHash: bcrypt.hashSync('admin123', 10),
    });
    console.log('Default admin account created: username "admin", password "admin123" - please change this after first login.');
  }

  // Customers (the supermarkets/shops you sell the POS software to)
  // Each client has an `active` flag - set to false to instantly revoke
  // their license across every device running that shop's POS software.
  db.ensureTable('clients', []);

  // License keys issued (history of every key generated, linked to a client)
  db.ensureTable('licenses', []);

  console.log('License Manager database initialized.');
}

module.exports = { seed };

