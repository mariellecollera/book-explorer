export default function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="w-full">
      <form
        className="flex items-center gap-5 max-w-[1200px] mx-auto px-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <input
          type="text"
          placeholder="Search for a book title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="bg-black text-[#fffffc] px-5 py-2 hover:opacity-90"
        >
          Search
        </button>
      </form>
    </div>
  );
}