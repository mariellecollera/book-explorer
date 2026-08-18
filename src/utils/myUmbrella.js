const STORAGE_KEY = "myUmbrellaBooks";

export function getMyUmbrella() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isInMyUmbrella(id) {
  return getMyUmbrella().some((b) => b.id === id);
}

export function addToMyUmbrella(book) {
  const books = getMyUmbrella();
  if (books.some((b) => b.id === book.id)) return books;
  const updated = [...books, book];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromMyUmbrella(id) {
  const updated = getMyUmbrella().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
