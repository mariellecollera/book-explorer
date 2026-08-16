import { useEffect, useRef, useState } from "react";

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "eng", label: "English" },
  { value: "spa", label: "Spanish" },
  { value: "fre", label: "French" },
  { value: "ger", label: "German" },
  { value: "jpn", label: "Japanese" },
  { value: "ita", label: "Italian" },
  { value: "por", label: "Portuguese" },
  { value: "chi", label: "Chinese" },
];

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  languageFilter,
  setLanguageFilter,
  accessibleOnly,
  setAccessibleOnly,
}) {
  const [previewBooks, setPreviewBooks] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(
    Array.isArray(languageFilter) ? languageFilter : [],
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [languageSearchInput, setLanguageSearchInput] = useState("");
  const searchRef = useRef(null);
  const languageDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsActive(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !isActive) {
      setPreviewBooks([]);
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        q: trimmedQuery,
        limit: "10",
        page: "1",
      });

      if (selectedLanguages.length > 0) {
        params.set("lang", selectedLanguages.join("|"));
      }
      if (accessibleOnly) params.set("has_fulltext", "true");

      setPreviewLoading(true);

      fetch(`https://openlibrary.org/search.json?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Preview request failed");
          return res.json();
        })
        .then((data) => {
          const docs = (data.docs || []).slice(0, 10);
          setPreviewBooks(
            docs.map((book) => ({
              id: book.key,
              title: book.title || "Untitled",
              year: book.first_publish_year || "Unknown year",
              author:
                (book.author_name && book.author_name[0]) || "Unknown author",
              language: (book.language && book.language[0]) || "Unknown",
            })),
          );
        })
        .catch(() => setPreviewBooks([]))
        .finally(() => setPreviewLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedLanguages, accessibleOnly, isActive]);

  const handleLanguageToggle = (langValue) => {
    const updatedLanguages = selectedLanguages.includes(langValue)
      ? selectedLanguages.filter((lang) => lang !== langValue)
      : [...selectedLanguages, langValue];
    setSelectedLanguages(updatedLanguages);
    setLanguageFilter(updatedLanguages);
  };

  return (
    <div ref={searchRef} className="w-full max-w-[900px] mx-auto">
      <form
        className="flex flex-col gap-0"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="relative flex items-center gap-5">
          <div className="flex flex-1 items-center gap-3 border border-black px-3 py-2 focus-within:ring-2 focus-within:ring-black">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-black/70"
            >
              <path
                d="M10.5 3a7.5 7.5 0 0 1 5.9 12.8l4.4 4.4 1.4-1.4-4.4-4.4A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                fill="currentColor"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for a book title or author"
              value={query}
              onFocus={() => setIsActive(true)}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent p-0 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setLanguageFilter("")}
                aria-label="Clear search"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-black text-xs hover:bg-black hover:text-white"
              >
                ×
              </button>
            )}

            <div className="w-full absolute z-50 top-[50px] left-0">
              {isActive && (
                <div className="w-full flex flex-col gap-3 border border-black bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  <div className="mt-4 flex items-start justify-start gap-4 px-5">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={accessibleOnly}
                        onChange={() => setAccessibleOnly((prev) => !prev)}
                        className="h-4 w-4 accent-black"
                      />
                      <span>Readable</span>
                    </label>

                    {isActive && (
                      <div
                        ref={languageDropdownRef}
                        className="relative w-[200px]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                          }
                          className="flex items-center justify-between gap-2 border border-black bg-white px-3 py-2 text-sm w-full hover:bg-black/5"
                        >
                          <span>Select languages</span>
                          <svg
                            className={`h-4 w-4 transition-transform ${
                              isLanguageDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>

                        {isLanguageDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-0 border border-t-0 border-black bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                            <div className="max-h-80 overflow-y-auto">
                              <label className="flex items-center gap-3 px-4 py-2 cursor-pointer border-b border-black hover:bg-black/5">
                                <input
                                  type="checkbox"
                                  checked={selectedLanguages.length === 0}
                                  onChange={() => {
                                    setSelectedLanguages([]);
                                    setLanguageFilter([]);
                                  }}
                                  className="h-4 w-4 accent-black"
                                />
                                <span className="text-sm font-medium">
                                  Any Language
                                </span>
                              </label>
                              {LANGUAGE_OPTIONS.filter(
                                (option) => option.value !== "all",
                              ).map((option) => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-black/5"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedLanguages.includes(
                                      option.value,
                                    )}
                                    onChange={() =>
                                      handleLanguageToggle(option.value)
                                    }
                                    className="h-4 w-4 accent-black"
                                  />
                                  <span className="text-sm">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="px-5 pb-3 flex items-center justify-between">
                      {(accessibleOnly || selectedLanguages.length > 0) && (
                        <button
                          type="button"
                          onClick={() => {
                            setAccessibleOnly(false);
                            setSelectedLanguages([]);
                            setLanguageFilter([]);
                          }}
                          className="text-xs font-medium text-black/70 hover:text-black border-b border-dashed"
                        >
                          Clear filters
                        </button>
                      )}
                      <div className="flex-1"></div>
                    </div>
                  </div>

                  <div className="px-5 pb-3">
                    <div className="max-h-80 overflow-y-auto rounded bg-white">
                      {previewLoading && (
                        <div className="px-2 py-3 italic text-sm text-black/70 text-center">
                          Searching...
                        </div>
                      )}

                      {!previewLoading &&
                        query.trim() &&
                        previewBooks.length === 0 && (
                          <div className="px-2 py-3 italic text-sm text-black/70 text-center">
                            No preview results match this search.
                          </div>
                        )}

                      {!previewLoading && previewBooks.length > 0 && (
                        <ul className="space-y-2 px-2 py-2">
                          {previewBooks.slice(0, 10).map((book) => (
                            <li
                              key={book.id}
                              className="rounded px-2 py-2 hover:bg-black/5"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setQuery(book.title);
                                  setIsActive(false);
                                  onSearch();
                                }}
                                className="flex w-full items-center justify-between gap-3 text-left"
                              >
                                <div className="min-w-0 flex-1 a ">
                                  <div className="flex gap-2 font-medium">
                                    <span className="truncate">
                                      {" "}
                                      {book.title}{" "}
                                    </span>
                                    <span className="text-sm text-black/70">
                                      {book.year}
                                    </span>
                                  </div>
                                  <div className="text-sm text-black/70">
                                    {book.author}
                                  </div>
                                </div>
                                <span className="shrink-0 rounded border border-black px-2 py-1 text-[10px] uppercase tracking-wide text-black/80">
                                  {book.language}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="button-black">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
