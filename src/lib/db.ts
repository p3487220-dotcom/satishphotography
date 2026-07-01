import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Resolve the database path relative to the project root
const DB_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "bookings.db");

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Open (or create) the database
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create the bookings table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    phone       TEXT    NOT NULL,
    package     TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    time        TEXT    NOT NULL,
    location    TEXT    NOT NULL,
    guests      TEXT,
    requests    TEXT,
    created_at  TEXT    DEFAULT (datetime('now', 'localtime'))
  )
`);

export default db;
