export type FavoriteBook = {
  id: string;
  title?: string;
  authors?: string; // comma-separated
  thumbnail?: string;
  publishedDate?: string;
  description?: string;
};

const WEB_KEY = 'favorites';
let initialized = false;

export async function initDB(): Promise<void> {
  initialized = true; // no-op on web
}

async function ensureInit() {
  if (!initialized) await initDB();
}

export async function addFavorite(book: FavoriteBook): Promise<void> {
  await ensureInit();
  const map = loadWebMap();
  map[book.id] = book;
  saveWebMap(map);
}

export async function removeFavorite(id: string): Promise<void> {
  await ensureInit();
  const map = loadWebMap();
  delete map[id];
  saveWebMap(map);
}

export async function listFavorites(): Promise<FavoriteBook[]> {
  await ensureInit();
  return Object.values(loadWebMap());
}

export async function getFavoriteById(id: string): Promise<FavoriteBook | null> {
  await ensureInit();
  const map = loadWebMap();
  return map[id] ?? null;
}

export async function isFavorite(id: string): Promise<boolean> {
  const fav = await getFavoriteById(id);
  return !!fav;
}

function loadWebMap(): Record<string, FavoriteBook> {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(WEB_KEY) : null;
    return raw ? (JSON.parse(raw) as Record<string, FavoriteBook>) : {};
  } catch {
    return {};
  }
}

function saveWebMap(map: Record<string, FavoriteBook>) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(WEB_KEY, JSON.stringify(map));
  } catch {}
}
