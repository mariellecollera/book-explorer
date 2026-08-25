import { useState, useEffect } from "react";
import { extractSynopsis } from "../utils/extractSynopsis";

const detailsCache = new Map();

export function useBookDetails(workKey, initialBook = null) {
  const cleanKey = workKey
    ? workKey.startsWith("/works/")
      ? workKey
      : `/works/${workKey}`
    : null;

  const [state, setState] = useState({
    book: initialBook || null,
    loading: true,
    notFound: false,
  });

  useEffect(() => {
    if (!cleanKey) return;

    if (detailsCache.has(cleanKey)) {
      const cached = detailsCache.get(cleanKey);
      setState({
        book: { ...cached, ...initialBook },
        loading: false,
        notFound: false,
      });
      return;
    }

    let cancelled = false;

    if (!initialBook) {
      setState((prev) => ({ ...prev, loading: true, notFound: false }));
    }

    (async () => {
      try {
        const [workData, editionsData, ratingsData] = await Promise.all([
          fetch(`https://openlibrary.org${cleanKey}.json`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(`https://openlibrary.org${cleanKey}/editions.json?limit=1`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(`https://openlibrary.org${cleanKey}/ratings.json`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        if (cancelled) return;

        if (!workData && !initialBook) {
          setState({ book: null, loading: false, notFound: true });
          return;
        }

        let authorName = initialBook?.author || "Unknown author";
        const authorKey = workData?.authors?.[0]?.author?.key;
        if (authorKey && authorName === "Unknown author") {
          const authorRes = await fetch(
            `https://openlibrary.org${authorKey}.json`,
          )
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          if (authorRes?.name) authorName = authorRes.name;
        }

        if (cancelled) return;

        const firstEdition = editionsData?.entries?.[0];
        const coverId = workData?.covers?.[0];

        const fetchedBook = {
          id: cleanKey,
          title: workData?.title || initialBook?.title || "Unknown Title",
          author: authorName,
          year: firstEdition?.publish_date || initialBook?.year || null,
          cover: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : initialBook?.cover || null,
          edition_count:
            editionsData?.size ?? initialBook?.edition_count ?? null,
          publisher:
            firstEdition?.publishers?.[0] ||
            initialBook?.raw?.publisher?.[0] ||
            "N/A",
          language:
            firstEdition?.languages?.[0]?.key?.replace("/languages/", "") ||
            initialBook?.raw?.language?.[0] ||
            "N/A",
          synopsis: extractSynopsis(workData),
          avgRating:
            typeof ratingsData?.summary?.average === "number"
              ? ratingsData.summary.average
              : null,
          ratingCount:
            typeof ratingsData?.summary?.count === "number"
              ? ratingsData.summary.count
              : 0,
        };

        detailsCache.set(cleanKey, fetchedBook);

        setState({
          book: fetchedBook,
          loading: false,
          notFound: false,
        });
      } catch {
        if (!cancelled) {
          setState({
            book: initialBook || null,
            loading: false,
            notFound: !initialBook,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cleanKey]);

  return state;
}
