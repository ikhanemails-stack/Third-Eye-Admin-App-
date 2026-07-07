// Third Eye Computer Solutions - License Manager
// Lightweight file-based JSON database engine (same approach as pos-app).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function ensureTable(table, defaultValue) {
  const fp = filePath(table);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(defaultValue, null, 2));
  }
}

function readTable(table) {
  const fp = filePath(table);
  if (!fs.existsSync(fp)) return [];
  const raw = fs.readFileSync(fp, 'utf-8');
  if (!raw.trim()) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    const backupPath = fp + '.bak';
    if (fs.existsSync(backupPath)) {
      return JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    }
    return [];
  }
}

function writeTable(table, data) {
  const fp = filePath(table);
  const backupPath = fp + '.bak';
  if (fs.existsSync(fp)) fs.copyFileSync(fp, backupPath);
  const tmpPath = fp + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, fp);
}

function nextId(rows) {
  if (rows.length === 0) return 1;
  return Math.max(...rows.map(r => r.id || 0)) + 1;
}

const db = {
  all(table) { return readTable(table); },
  find(table, predicate) { return readTable(table).find(predicate); },
  filter(table, predicate) { return readTable(table).filter(predicate); },
  getById(table, id) { return readTable(table).find(r => r.id === Number(id)); },
  insert(table, record) {
    const rows = readTable(table);
    const id = nextId(rows);
    const now = new Date().toISOString();
    const newRecord = Object.assign({ id, createdAt: now, updatedAt: now }, record);
    rows.push(newRecord);
    writeTable(table, rows);
    return newRecord;
  },
  update(table, id, updates) {
    const rows = readTable(table);
    const idx = rows.findIndex(r => r.id === Number(id));
    if (idx === -1) return null;
    rows[idx] = Object.assign({}, rows[idx], updates, { updatedAt: new Date().toISOString() });
    writeTable(table, rows);
    return rows[idx];
  },
  delete(table, id) {
    const rows = readTable(table);
    const idx = rows.findIndex(r => r.id === Number(id));
    if (idx === -1) return false;
    rows.splice(idx, 1);
    writeTable(table, rows);
    return true;
  },
  ensureTable
};

module.exports = db;
