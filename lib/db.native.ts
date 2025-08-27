import * as SQLite from 'expo-sqlite';

export type FavoriteBook = {
  id: string;
  title?: string;
  authors?: string; // comma-separated
  thumbnail?: string;
  publishedDate?: string;
  description?: string;
};

let db: SQLite.SQLiteDatabase | null = null;
let initialized = false;

function getDB(): SQLite.SQLiteDatabase {
  if (!db) db = SQLite.openDatabaseSync('books.db');
  return db;
}

export async function initDB(): Promise<void> {
  if (initialized) return;
  const database = getDB();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      authors TEXT,
      thumbnail TEXT,
      publishedDate TEXT,
      description TEXT
    );
  `);
  initialized = true;
}

async function ensureInit() {
  if (!initialized) await initDB();
}

export async function addFavorite(book: FavoriteBook): Promise<void> {
  await ensureInit();
  const { id, title, authors, thumbnail, publishedDate, description } = book;
  await getDB().runAsync(
    `INSERT OR REPLACE INTO favorites (id, title, authors, thumbnail, publishedDate, description) VALUES (?, ?, ?, ?, ?, ?);`,
    [id, title ?? '', authors ?? '', thumbnail ?? '', publishedDate ?? '', description ?? '']
  );
}

export async function removeFavorite(id: string): Promise<void> {
  await ensureInit();
  await getDB().runAsync(`DELETE FROM favorites WHERE id = ?;`, [id]);
}

export async function listFavorites(): Promise<FavoriteBook[]> {
  await ensureInit();
  const rows = await getDB().getAllAsync<FavoriteBook>(
    `SELECT id, title, authors, thumbnail, publishedDate, description FROM favorites ORDER BY title ASC;`
  );
  return rows;
}

export async function getFavoriteById(id: string): Promise<FavoriteBook | null> {
  await ensureInit();
  const row = await getDB().getFirstAsync<FavoriteBook>(
    `SELECT id, title, authors, thumbnail, publishedDate, description FROM favorites WHERE id = ? LIMIT 1;`,
    [id]
  );
  return row ?? null;
}

export async function isFavorite(id: string): Promise<boolean> {
  const fav = await getFavoriteById(id);
  return !!fav;
}
