import { Pool } from "pg";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

type QueryResult = {
  rows: unknown[];
  rowCount?: number | null;
};

class SqliteAdapter {
  private db: Database.Database;

  constructor() {
    const DB_DIR = path.resolve(process.cwd(), "data");
    const DB_PATH = path.join(DB_DIR, "bookings.db");

    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    this.db = new Database(DB_PATH);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
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

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT    NOT NULL,
        role        TEXT    NOT NULL DEFAULT 'Client',
        text        TEXT    NOT NULL,
        rating      INTEGER NOT NULL,
        location    TEXT,
        created_at  TEXT    DEFAULT (datetime('now', 'localtime'))
      )
    `);
  }

  async query(text: string, params: unknown[] = []): Promise<QueryResult> {
    const normalized = text.trim().replace(/\s+/g, " ").toUpperCase();

    if (normalized.startsWith("SELECT")) {
      const stmt = this.db.prepare(text);
      return { rows: stmt.all(...params) as unknown[] };
    }

    if (normalized.startsWith("INSERT")) {
      const insertSql = text.replace(/\s+RETURNING\s+id\s*$/i, "");
      const stmt = this.db.prepare(insertSql);
      const info = stmt.run(...params);

      if (normalized.includes("RETURNING")) {
        return {
          rows: typeof info.lastInsertRowid === "number" ? [{ id: info.lastInsertRowid }] : [],
          rowCount: info.changes,
        };
      }

      return { rows: [], rowCount: info.changes };
    }

    if (normalized.startsWith("DELETE")) {
      const stmt = this.db.prepare(text);
      const info = stmt.run(...params);
      return { rows: [], rowCount: info.changes };
    }

    if (normalized.startsWith("UPDATE")) {
      const stmt = this.db.prepare(text);
      const info = stmt.run(...params);
      return { rows: [], rowCount: info.changes };
    }

    throw new Error(`Unsupported SQL query: ${text}`);
  }
}

class PostgresAdapter {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async query(text: string, params: unknown[] = []): Promise<QueryResult> {
    const result = await this.pool.query(text, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount ?? result.rows.length,
    };
  }
}

class DatabaseClient {
  private postgres: PostgresAdapter | null = null;
  private sqlite: SqliteAdapter | null = null;
  private usePostgres = Boolean(process.env.DATABASE_URL);

  constructor() {
    if (process.env.DATABASE_URL) {
      this.postgres = new PostgresAdapter(process.env.DATABASE_URL);
    }
    this.sqlite = new SqliteAdapter();
  }

  async query(text: string, params: unknown[] = []): Promise<QueryResult> {
    if (this.usePostgres && this.postgres) {
      try {
        return await this.postgres.query(text, params);
      } catch (error) {
        console.warn("PostgreSQL unavailable, falling back to SQLite.", error);
        this.usePostgres = false;
      }
    }

    if (!this.sqlite) {
      this.sqlite = new SqliteAdapter();
    }

    return this.sqlite.query(text, params);
  }
}

const db = new DatabaseClient();

export default db;
