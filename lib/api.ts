export type GoogleBook = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

export async function searchBooks(query: string): Promise<GoogleBook[]> {
  if (!query || !query.trim()) return [];
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  return (json.items || []) as GoogleBook[];
}

export async function getBookById(id: string): Promise<GoogleBook | null> {
  const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  return json as GoogleBook;
}
