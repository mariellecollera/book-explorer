export default function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="w-full max-w-[900px] mx-auto">
      <form
        className="flex items-center gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
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
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent p-0 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-black text-xs hover:bg-black hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className="button-black">
          Search
        </button>
      </form>
    </div>
  );
}
