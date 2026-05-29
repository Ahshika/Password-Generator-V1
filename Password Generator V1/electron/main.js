import { app, BrowserWindow, ipcMain } from 'electron'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url));
import sqlite3 from 'sqlite3'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import crypto from 'node:crypto'

let mainWindow;

// Initialize SQLite database
const dbPath = join(app.getPath('userData'), 'passwords.sqlite')
const db = new sqlite3.Database(dbPath)

// Initialize database schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site TEXT,
    username TEXT,
    encrypted_password TEXT,
    iv TEXT
  )`);
});

// Helper functions for AES-256 encryption
const ALGORITHM = 'aes-256-cbc';

function getEncryptionKey() {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM settings WHERE key = 'encryption_key'", (err, row) => {
      if (err) return reject(err);
      if (row) {
        resolve(Buffer.from(row.value, 'hex'));
      } else {
        const newKey = crypto.randomBytes(32);
        db.run("INSERT INTO settings (key, value) VALUES ('encryption_key', ?)", [newKey.toString('hex')], (err) => {
          if (err) reject(err);
          else resolve(newKey);
        });
      }
    });
  });
}

async function encrypt(text) {
  const key = await getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

async function decrypt(encryptedText, ivHex) {
  const key = await getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// IPC Handlers
// Hardcoded secret for the single database owner
const MASTER_TOTP_SECRET = 'FFTHSKCSEYWDIN2HK5MF4WTVFRDTG6TBGMXXKSTJJ5TEW42LJUUQ';

ipcMain.handle('verify-totp-login', async (_, token) => {
  return speakeasy.totp.verify({
    secret: MASTER_TOTP_SECRET,
    encoding: 'base32',
    token: token,
    window: 1
  });
});

ipcMain.handle('get-passwords', async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM passwords", async (err, rows) => {
      if (err) return reject(err);
      
      try {
        const decryptedRows = await Promise.all(rows.map(async (row) => ({
          ...row,
          password: await decrypt(row.encrypted_password, row.iv)
        })));
        resolve(decryptedRows);
      } catch (e) {
        reject(e);
      }
    });
  });
});

ipcMain.handle('add-password', async (_, site, username, password) => {
  const { encrypted, iv } = await encrypt(password);
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO passwords (site, username, encrypted_password, iv) VALUES (?, ?, ?, ?)", 
      [site, username, encrypted, iv], 
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, site, username, password });
      }
    );
  });
});

ipcMain.handle('delete-password', async (_, id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM passwords WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
});


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a0a',
      symbolColor: '#facc15',
    },
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
