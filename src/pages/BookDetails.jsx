import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PlaceholderCover from "../components/PlaceholderCover";
import {
  addToMyUmbrella,
  isInMyUmbrella,
  removeFromMyUmbrella,
} from "../utils/myUmbrella";

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

  useEffect(() => {
    let cancelled = false;
    const fullWorkKey = `/works/${workKey}`;

    async function fetchBaseBook() {
      if (location.state?.book) return location.state.book;
      try {
        const [workData, editionsData] = await Promise.all([
          fetch(`https://openlibrary.org${fullWorkKey}.json`).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch(
            `https://openlibrary.org${fullWorkKey}/editions.json?limit=1`,
          ).then((r) => (r.ok ? r.json() : null)),
        ]);
        if (!workData) return null;

        let authorName = "Unknown";
        const authorKey = workData.authors?.[0]?.author?.key;
        if (authorKey) {
          const authorData = await fetch(
            `https://openlibrary.org${authorKey}.json`,
          ).then((r) => (r.ok ? r.json() : null));
          if (authorData?.name) authorName = authorData.name;
        }

        const firstEdition = editionsData?.entries?.[0];
        const coverId = workData.covers?.[0];

        return {
          id: fullWorkKey,
          title: workData.title,
          author: authorName,
          year: firstEdition?.publish_date || null,
          cover: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : null,
          edition_count: editionsData?.size ?? null,
          raw: {
            key: fullWorkKey,
            publisher: firstEdition?.publishers || [],
            language:
              firstEdition?.languages?.map((l) =>
                l.key?.replace("/languages/", ""),
              ) || [],
            isbn: firstEdition?.isbn_13 || firstEdition?.isbn_10 || [],
          },
        };
      } catch {
        return null;
      }
    }

    async function fetchDetails(workKeyPath) {
      const workUrl = `https://openlibrary.org${workKeyPath}.json`;
      const ratingsUrl = `https://openlibrary.org${workKeyPath}/ratings.json`;

      const [workRes, ratingsRes] = await Promise.allSettled([
        fetch(workUrl).then((r) =>
          r.ok ? r.json() : Promise.reject("work fetch failed"),
        ),
        fetch(ratingsUrl).then((r) =>
          r.ok ? r.json() : Promise.reject("ratings fetch failed"),
        ),
      ]);

      if (cancelled) return;

      if (workRes.status === "fulfilled") {
        const data = workRes.value;
        let desc = null;
        if (data.description)
          desc =
            typeof data.description === "string"
              ? data.description
              : data.description.value;
        else if (data.excerpts && data.excerpts.length > 0)
          desc = data.excerpts[0].excerpt || data.excerpts[0].comment || null;
        setSynopsis(desc);
      } else {
        setSynopsis(null);
      }

      if (ratingsRes.status === "fulfilled") {
        const r = ratingsRes.value;
        if (r && typeof r === "object") {
          setAvgRating(
            r.summary && typeof r.summary.average === "number"
              ? r.summary.average
              : null,
          );
          setRatingCount(
            r.summary && typeof r.summary.count === "number"
              ? r.summary.count
              : 0,
          );
        }
      }
    }

    setLoading(true);
    setNotFound(false);
    setSynopsis(null);
    setAvgRating(null);
    setRatingCount(0);
    (async () => {
      const baseBook = await fetchBaseBook();
      if (cancelled) return;
      if (!baseBook) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setBook(baseBook);
      await fetchDetails(baseBook.raw?.key || fullWorkKey);
      if (!cancelled) setLoading(false);
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
  const firstISBN = book?.raw?.isbn?.[0] || "N/A";

  useEffect(() => {
    setInUmbrella(book ? isInMyUmbrella(book.id) : false);
  }, [book]);

  function toggleUmbrella() {
    if (!book) return;
    if (inUmbrella) {
      removeFromMyUmbrella(book.id);
      setInUmbrella(false);
    } else {
      addToMyUmbrella(book);
      setInUmbrella(true);
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto px-5 py-8 max-w-5xl">
        <button onClick={() => navigate(-1)} className="button-black mb-6">
          ← Back to Results
        </button>
        <div className="text-center italic py-20">Book not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-5 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="button-black mb-6">
        ← Back to Results
      </button>

      {loading ? (
        <BookDetailsSkeleton />
      ) : (
        <div className="flex gap-8">
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center justify-center w-56">
              <div className="w-full h-[320px] border mb-2">
                {cover ? (
                  <img
                    src={cover}
                    alt={`${title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderCover
                    cover={cover}
                    title={title}
                    year={year}
                    author={author}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={toggleUmbrella}
                className="button-black"
              >
                {inUmbrella ? "Remove from My Umbrella" : "Add to My Umbrella"}
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

            <div className="mt-6 border p-4 w-full max-w-md">
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
              <div className="text-sm">
                ISBN: <span className="font-medium">{firstISBN}</span>
              </div>
            </div>
          </div>
        </div>
      )}
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

        <div className="border p-4 w-full max-w-md space-y-2">
          <div className="h-4 w-1/2 bg-gray-200" />
          <div className="h-4 w-1/3 bg-gray-200" />
          <div className="h-4 w-1/4 bg-gray-200" />
          <div className="h-4 w-2/5 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
