import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookGrid from "../components/BookGrid";
import umbrella from "/favicon.svg";
import empty from "../assets/no_books.svg";

const resultsCache = new Map();

export default function Results() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const [totalResults, setTotalResults] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const perPage = 40;

  useEffect(() => {
    setQuery(q);
    if (!q) return;

    const cacheKey = `${q.toLowerCase()}-${page}-${perPage}`;
    const cached = resultsCache.get(cacheKey);

    // Already fetched this exact search + page before — reuse it,
    // no network call, no loading flicker.
    if (cached) {
      setBooks(cached.books);
      setTotalResults(cached.totalResults);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q,
      page: String(page),
      limit: String(perPage),
    });

    fetch(`https://openlibrary.org/search.json?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const docs = data.docs || [];
        const mapped = docs.map((d) => ({
          id: d.key,
          title: d.title,
          author: (d.author_name && d.author_name[0]) || "Unknown",
          year: d.first_publish_year,
          cover: d.cover_i
            ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
            : null,
          subjects: d.subject || [],
          edition_count: d.edition_count,
          raw: d,
        }));
        const result = { books: mapped, totalResults: data.numFound || 0 };

        resultsCache.set(cacheKey, result);
        setBooks(result.books);
        setTotalResults(result.totalResults);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to fetch");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, page]);

  function onSearch() {
    if (!query || query.trim() === "") return;
    navigate(`/results?q=${encodeURIComponent(query)}&page=1`);
  }

  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / perPage));

  function goToPage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    navigate(`/results?q=${encodeURIComponent(query)}&page=${newPage}`);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-5 py-8">
        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />

        <div className="mt-6">
          {loading && (
            <div className="py-20 flex items-center justify-center">
              <img
                src={umbrella}
                alt="loading"
                className="w-30 h-30 animate-pulse"
              />
            </div>
          )}
          {error && (
            <div className="py-8 text-center text-red-600">{error}</div>
          )}
          {!loading && !error && books.length === 0 && (
            <div className="py-8 flex flex-col items-center justify-center italic text-[18px]">
              <img
                src={empty}
                alt="No books found"
                className="w-30 h-30 mb-2"
              />
              No books found.
            </div>
          )}

          {!loading && books.length > 0 && (
            <>
              <div className="text-2xl mb-6">Showing results for “{q}”</div>
              <BookGrid books={books} isMyUmbrella={false} />

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className={page <= 1 ? "button-white" : "button-black"}
                >
                  Prev
                </button>
                <div>
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className={
                    page >= totalPages ? "button-white" : "button-black"
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
