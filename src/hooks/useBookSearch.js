import { useState, useEffect } from "react";

const resultsCache = new Map();

export function useBookSearch(query, page = 1, perPage = 40) {
  const [data, setData] = useState({
    books: [],
    totalResults: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!query || query.trim() === "") {
      setData({ books: [], totalResults: 0, loading: false, error: null });
      return;
    }

    const cacheKey = `${query.toLowerCase().trim()}-${page}-${perPage}`;
    const cached = resultsCache.get(cacheKey);

    if (cached) {
      setData({
        books: cached.books,
        totalResults: cached.totalResults,
        loading: false,
        error: null,
      });
      return;
    }

    const controller = new AbortController();

    setData((prev) => ({ ...prev, loading: true, error: null }));

    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(perPage),
    });

    fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load books.");
        return res.json();
      })
      .then((json) => {
        const docs = json.docs || [];
        const mappedBooks = docs.map((d) => ({
          id: d.key,
          title: d.title,
          author: d.author_name?.[0] || "Unknown",
          year: d.first_publish_year,
          cover: d.cover_i
            ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
            : null,
          subjects: d.subject || [],
          edition_count: d.edition_count,
          raw: d,
        }));

        const result = {
          books: mappedBooks,
          totalResults: json.numFound || 0,
        };

        resultsCache.set(cacheKey, result);

        setData({
          books: result.books,
          totalResults: result.totalResults,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err.message || "Failed to fetch search results.",
          }));
        }
      });

    return () => controller.abort();
  }, [query, page, perPage]);

  return data;
}
