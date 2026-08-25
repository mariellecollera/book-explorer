import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import SearchBar from "../components/SearchBar";
import BookGrid from "../components/BookGrid";
import { useBookSearch } from "../hooks/useBookSearch";

export default function Results() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const navigate = useNavigate();
  const perPage = 40;

  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  const { books, totalResults, loading, error } = useBookSearch(
    q,
    page,
    perPage,
  );

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
          {loading && <LoadingState />}

          {error && <ErrorState error={error} />}

          {!loading && !error && books.length === 0 && q && <EmptyState />}

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
