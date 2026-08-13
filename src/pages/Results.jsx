import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ResultsCard from '../components/ResultsCard'
import BookModal from '../components/BookModal'
import umbrellaIcon from "/umbrellaWhite.svg";

export default function Results() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)
  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1
  const [page, setPage] = useState(pageParam)
  const [totalResults, setTotalResults] = useState(0)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const navigate = useNavigate()
  const perPage = 20

  useEffect(() => {
    setQuery(q)
    setPage(pageParam)
    if (!q) return
    setLoading(true)
    setError(null)
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&page=${pageParam}&limit=${perPage}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        const docs = data.docs || []
        setTotalResults(data.numFound || 0)
        const mapped = docs.map((d) => ({
          id: d.key,
          title: d.title,
          author: (d.author_name && d.author_name[0]) || 'Unknown',
          year: d.first_publish_year,
          cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : umbrellaIcon,
          subjects: d.subject || [],
          edition_count: d.edition_count,
          raw: d,
        }))
        setBooks(mapped)
      })
      .catch((err) => setError(err.message || 'Failed to fetch'))
      .finally(() => setLoading(false))
  }, [q, pageParam])

  function onSearch() {
    if (!query || query.trim() === '') return
    navigate(`/results?q=${encodeURIComponent(query)}&page=1`)
  }

  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / perPage))

  function goToPage(newPage) {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    navigate(`/results?q=${encodeURIComponent(query)}&page=${newPage}`)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />

        <div className="mt-6">
          <div className="text-2xl mb-6">Showing results for “{q}”</div>

          {loading && <div className="py-8 text-center">Loading...</div>}
          {error && <div className="py-8 text-center text-red-600">{error}</div>}
          {!loading && !error && books.length === 0 && <div className="py-8">No books found.</div>}

          {!loading && books.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {books.map((b) => (
                  <ResultsCard key={b.id} {...b} onSelect={() => setSelectedBook(b)} />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <div>Page {page} of {totalPages}</div>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  )
}
