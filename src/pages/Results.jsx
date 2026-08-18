import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LANGUAGE_OPTIONS } from "../components/SearchBar";
import SearchBar from "../components/SearchBar";
import ResultsCard from "../components/ResultsCard";
import Tag from "../components/Tag";
import umbrella from "/favicon.svg";
import empty from "../assets/no_books.svg";

function languageLabel(code) {
  return LANGUAGE_OPTIONS.find((opt) => opt.value === code)?.label || code;
}

export default function Results() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const languageParamRaw = searchParams.get("language") || "";
  const languageParam = languageParamRaw.split("|").filter(Boolean);
  const readableParam = searchParams.get("readable") === "1";
  const [query, setQuery] = useState(q);
  const [languageFilter, setLanguageFilter] = useState(languageParam);
  const [accessibleOnly, setAccessibleOnly] = useState(readableParam);
  const pageParam = parseInt(searchParams.get("page") || "1", 10) || 1;
  const [page, setPage] = useState(pageParam);
  const [totalResults, setTotalResults] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const perPage = 20;

  useEffect(() => {
    const currentLanguageParam = languageParamRaw.split("|").filter(Boolean);

    setQuery(q);
    setPage(pageParam);
    setLanguageFilter(currentLanguageParam);
    setAccessibleOnly(readableParam);
    if (!q) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q,
      page: String(pageParam),
      limit: String(perPage),
    });

    if (currentLanguageParam.length > 0)
      params.set("language", currentLanguageParam.join("|"));
    if (readableParam) params.set("has_fulltext", "true");

    fetch(`https://openlibrary.org/search.json?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const docs = data.docs || [];
        setTotalResults(data.numFound || 0);
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
        setBooks(mapped);
      })
      .catch((err) => setError(err.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  }, [q, pageParam, languageParamRaw, readableParam]);

  function onSearch() {
    if (!query || query.trim() === "") return;
    navigate(
      `/results?q=${encodeURIComponent(query)}&page=1&language=${encodeURIComponent(languageFilter.join("|"))}&readable=${accessibleOnly ? "1" : "0"}`,
    );
  }

  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / perPage));

  function goToPage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    navigate(
      `/results?q=${encodeURIComponent(query)}&page=${newPage}&language=${encodeURIComponent(languageFilter.join("|"))}&readable=${accessibleOnly ? "1" : "0"}`,
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-5 py-8">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={onSearch}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
          accessibleOnly={accessibleOnly}
          setAccessibleOnly={setAccessibleOnly}
        />

        <div className="mt-6">
          <div className="text-2xl mb-6">
            Showing results for “{q}”
            {languageFilter.length > 0 || accessibleOnly ? (
              <div className="text-base text-white flex gap-2">
                {accessibleOnly && <Tag label="Readable" />}

                {languageFilter.map((lang) => (
                  <Tag key={lang} label={languageLabel(lang)} />
                ))}
              </div>
            ) : null}
          </div>

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
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-2 gap-y-4 items-start place-items-center">
                {books.map((b) => (
                  <ResultsCard
                    key={b.id}
                    {...b}
                    onSelect={() =>
                      navigate(
                        `/book/${encodeURIComponent(b.id.replace("/works/", ""))}`,
                        {
                          state: { book: b },
                        },
                      )
                    }
                  />
                ))}
              </div>

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
