import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PlaceholderCover from "../components/PlaceholderCover";
import Modal from "../components/Modal";
import {
  addToMyUmbrella,
  isInMyUmbrella,
  removeFromMyUmbrella,
} from "../utils/myUmbrella";
import {
  fetchWorkData,
  fetchEditionInfo,
  fetchAuthorName,
  fetchRatings,
  extractSynopsis,
} from "../utils/openLibrary";

export default function BookDetails() {
  const { workKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [book, setBook] = useState(location.state?.book || null);
  const [synopsis, setSynopsis] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inUmbrella, setInUmbrella] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fullWorkKey = `/works/${workKey}`;

    (async () => {
      setLoading(true);
      setNotFound(false);
      setSynopsis(null);
      setAvgRating(null);
      setRatingCount(0);

      const cameFromSearch = Boolean(location.state?.book);

      // ---- Case 1: we already have title/author/cover from the search
      // results page. We only need editions info (publisher/language),
      // synopsis, and ratings — none of which depend on each other, so
      // fetch all three at the same time. ----
      if (cameFromSearch) {
        const stateBook = location.state.book;
        const workKeyPath = stateBook.raw?.key || fullWorkKey;
        setBook(stateBook);

        const [editionInfo, workData, ratings] = await Promise.all([
          fetchEditionInfo(workKeyPath),
          fetchWorkData(workKeyPath),
          fetchRatings(workKeyPath),
        ]);
        if (cancelled) return;

        setBook((prev) => ({
          ...prev,
          year: prev.year || editionInfo.year,
          edition_count: prev.edition_count ?? editionInfo.edition_count,
          raw: {
            ...prev.raw,
            publisher: editionInfo.publisher.length
              ? editionInfo.publisher
              : prev.raw?.publisher || [],
            language: editionInfo.language.length
              ? editionInfo.language
              : prev.raw?.language || [],
          },
        }));
        setSynopsis(extractSynopsis(workData));
        setAvgRating(ratings.avgRating);
        setRatingCount(ratings.ratingCount);
        setLoading(false);
        return;
      }

      // ---- Case 2: direct URL visit, no book data at all yet.
      // work, editions, and ratings don't depend on each other either —
      // fetch all three at once. Author name depends on the author key
      // inside workData, so that one has to wait. ----
      const [workData, editionInfo, ratings] = await Promise.all([
        fetchWorkData(fullWorkKey),
        fetchEditionInfo(fullWorkKey),
        fetchRatings(fullWorkKey),
      ]);
      if (cancelled) return;

      if (!workData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const authorKey = workData.authors?.[0]?.author?.key;
      const authorName = authorKey
        ? await fetchAuthorName(authorKey)
        : "Unknown";
      if (cancelled) return;

      const coverId = workData.covers?.[0];
      const newBook = {
        id: fullWorkKey,
        title: workData.title,
        author: authorName,
        year: editionInfo.year,
        cover: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : null,
        edition_count: editionInfo.edition_count,
        raw: {
          key: fullWorkKey,
          publisher: editionInfo.publisher,
          language: editionInfo.language,
        },
      };

      setBook(newBook);
      setSynopsis(extractSynopsis(workData));
      setAvgRating(ratings.avgRating);
      setRatingCount(ratings.ratingCount);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workKey]);

  const filledStars = avgRating ? Math.round(avgRating) : 0;
  const maxStars = 5;

  const firstPublisher = book?.raw?.publisher?.[0] || "N/A";
  const firstLanguage = book?.raw?.language?.[0] || "N/A";

  useEffect(() => {
    setInUmbrella(book ? isInMyUmbrella(book.id) : false);
  }, [book]);

  function toggleUmbrella() {
    if (!book) return;
    if (inUmbrella) {
      removeFromMyUmbrella(book.id);
      setInUmbrella(false);
      setModalMessage(`"${book.title}" is no longer in your Umbrella.`);
    } else {
      addToMyUmbrella(book);
      setInUmbrella(true);
      setModalMessage(`"${book.title}" is now in your Umbrella.`);
    }
    setModalOpen(true);
  }

  if (notFound) {
    return (
      <div className="mx-auto px-5 py-8 max-w-5xl">
        <button onClick={() => navigate(-1)} className="button-black mb-6">
          ← Back
        </button>
        <div className="text-center italic py-20">Book not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-5 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="button-black mb-6">
        ← Back
      </button>

      {loading ? (
        <BookDetailsSkeleton />
      ) : (
        <div className="flex gap-8">
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center justify-center w-56">
              <div className="w-full h-[320px] border mb-2">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderCover
                    cover={book.cover}
                    title={book.title}
                    year={book.year}
                    author={book.author}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={toggleUmbrella}
                className="button-black"
              >
                {inUmbrella
                  ? "Remove from My Umbrella"
                  : "+ Add to My Umbrella"}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div>
              <h3 className="text-2xl font-serif mr-4 inline">{book.title}</h3>
              <span className="text-gray-500 ml-2">{book.year || ""}</span>
              <div className="italic text-gray-700 mt-1">{book.author}</div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: maxStars }).map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < filledStars ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {avgRating ? avgRating.toFixed(1) : "—"} ({ratingCount})
                </div>
              </div>
            </div>

            <div className="mt-6 text-base leading-relaxed text-gray-800">
              {synopsis || "Synopsis not available."}
            </div>

            <div className="mt-6 border p-4 w-full">
              <div className="text-sm">
                Number of Editions:{" "}
                <span className="font-medium">
                  {book.edition_count ?? "N/A"}
                </span>
              </div>
              <div className="text-sm">
                Publisher: <span className="font-medium">{firstPublisher}</span>
              </div>
              <div className="text-sm">
                Language: <span className="font-medium">{firstLanguage}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={inUmbrella ? "Successfully Added!" : "Successfully Removed."}
        message={modalMessage}
      />
    </div>
  );
}

function BookDetailsSkeleton() {
  return (
    <div className="flex gap-8 animate-pulse">
      <div className="flex-shrink-0">
        <div className="flex flex-col items-center justify-center w-56">
          <div className="w-full h-[320px] bg-gray-200 border mb-2" />
          <div className="h-9 w-full bg-gray-200" />
        </div>
      </div>

      <div className="flex-1">
        <div className="h-7 w-2/3 bg-gray-200 mb-3" />
        <div className="h-4 w-1/3 bg-gray-200 mb-4" />
        <div className="h-5 w-40 bg-gray-200 mb-6" />

        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-200" />
          <div className="h-4 w-full bg-gray-200" />
          <div className="h-4 w-5/6 bg-gray-200" />
          <div className="h-4 w-3/4 bg-gray-200" />
        </div>

        <div className="border p-4 w-full space-y-2">
          <div className="h-4 w-1/2 bg-gray-200" />
          <div className="h-4 w-1/3 bg-gray-200" />
          <div className="h-4 w-1/4 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
