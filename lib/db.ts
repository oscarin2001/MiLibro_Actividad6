import { Platform } from 'react-native';

export type FavoriteBook = {
  id: string;
  title?: string;
  authors?: string; // comma-separated
  thumbnail?: string;
  publishedDate?: string;
  description?: string;
};

// Conditional forwarder to platform-specific implementations
// Avoid importing expo-sqlite on Web to prevent SharedArrayBuffer/WASM requirements.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const impl = Platform.OS === 'web' ? require('./db.web') : require('./db.native');

export const initDB: () => Promise<void> = impl.initDB;
export const addFavorite: (book: FavoriteBook) => Promise<void> = impl.addFavorite;
export const removeFavorite: (id: string) => Promise<void> = impl.removeFavorite;
export const listFavorites: () => Promise<FavoriteBook[]> = impl.listFavorites;
export const getFavoriteById: (id: string) => Promise<FavoriteBook | null> = impl.getFavoriteById;
export const isFavorite: (id: string) => Promise<boolean> = impl.isFavorite;
