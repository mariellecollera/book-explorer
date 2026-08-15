import { useEffect, useState } from 'react'

export default function BookModal({ book, onClose }) {
  const [synopsis, setSynopsis] = useState(null)
  const [avgRating, setAvgRating] = useState(null)
  const [ratingCount, setRatingCount] = useState(0)

  useEffect(() => {
    if (!book) return
    setSynopsis(null)
    setAvgRating(null)
    setRatingCount(0)

    const workKey = book?.raw?.key
    if (!workKey) return

    // Fetch work details and ratings concurrently
    const workUrl = `https://openlibrary.org${workKey}.json`
    const ratingsUrl = `https://openlibrary.org${workKey}/ratings.json`

    Promise.allSettled([
      fetch(workUrl).then((r) => (r.ok ? r.json() : Promise.reject('work fetch failed'))),
      fetch(ratingsUrl).then((r) => (r.ok ? r.json() : Promise.reject('ratings fetch failed'))),
    ])
      .then(([workRes, ratingsRes]) => {
        if (workRes.status === 'fulfilled') {
          const data = workRes.value
          let desc = null
          if (data.description) desc = typeof data.description === 'string' ? data.description : data.description.value
          else if (data.excerpts && data.excerpts.length > 0) desc = data.excerpts[0].excerpt || data.excerpts[0].comment || null
          setSynopsis(desc)
        } else {
          setSynopsis(null)
        }

        if (ratingsRes.status === 'fulfilled') {
          const r = ratingsRes.value
          if (r && typeof r === 'object') {
            setAvgRating(r.summary && typeof r.summary.average === 'number' ? r.summary.average : null)
            setRatingCount(r.summary && typeof r.summary.count === 'number' ? r.summary.count : 0)
          }
        }
      })
      .catch(() => {
        setSynopsis(null)
      })
  }, [book])

  if (!book) return null

  const filledStars = avgRating ? Math.round(avgRating) : 0
  const maxStars = 5

  const firstPublisher = book.raw?.publisher?.[0] || 'N/A'
  const firstLanguage = book.raw?.language?.[0] || 'N/A'
  const firstISBN = book.raw?.isbn?.[0] || 'N/A'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-5xl w-full bg-white rounded shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center  justify-center w-56">
                <div className="f w-full h-[320px] relative border mb-2">
                  {!book && null}
                  <CoverWithPlaceholder src={book.cover} alt={`${book.title} cover`} />
                </div>
                <button type="submit" className="button-black">Add to My Umbrella</button>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-serif mr-4 inline">{book.title}</h3>
                  <span className="text-gray-500 ml-2">{book.year || ''}</span>
                  <div className="italic text-gray-700 mt-1">{book.author}</div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: maxStars }).map((_, i) => (
                        <span key={i} className="text-xl">{i < filledStars ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{avgRating ? avgRating.toFixed(1) : '—'} ({ratingCount})</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-base leading-relaxed text-gray-800">
                {synopsis || 'Synopsis not available.'}
              </div>

              <div className="mt-6 border p-4 w-full max-w-md">
                <div className="text-sm">Number of Editions: <span className="font-medium">{book.edition_count ?? 'N/A'}</span></div>
                <div className="text-sm">Publisher: <span className="font-medium">{firstPublisher}</span></div>
                <div className="text-sm">Language: <span className="font-medium">{firstLanguage}</span></div>
                <div className="text-sm">ISBN: <span className="font-medium">{firstISBN}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 bg-black text-white">Close</button>
        </div>
      </div>
    </div>
  )
}

function CoverWithPlaceholder({ src, alt }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <img src="/favicon.svg" alt="loading" className="w-20 h-20 animate-spin" style={{ animationDuration: '1400ms' }} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}
