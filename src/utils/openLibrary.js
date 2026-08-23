const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

/**
 * Fetch the raw "work" JSON for a book (title, description, author key, etc).
 *
 * @param {string} workKeyPath e.g. "/works/OL27448W"
 * @returns {Promise<object|null>}
 */
export async function fetchWorkData(workKeyPath) {
  try {
    return await fetch(`${OPEN_LIBRARY_BASE_URL}${workKeyPath}.json`).then(
      (r) => (r.ok ? r.json() : null),
    );
  } catch {
    return null;
  }
}

/**
 * Fetch edition-level info (publisher, language, year, edition count).
 * search.json does NOT return these fields by default — only the
 * editions endpoint does, so this is the only source for them.
 *
 * @param {string} workKeyPath e.g. "/works/OL27448W"
 * @returns {Promise<{edition_count: number|null, year: string|null, publisher: string[], language: string[]}>}
 */
export async function fetchEditionInfo(workKeyPath) {
  try {
    const editionsData = await fetch(
      `${OPEN_LIBRARY_BASE_URL}${workKeyPath}/editions.json?limit=1`,
    ).then((r) => (r.ok ? r.json() : null));

    const firstEdition = editionsData?.entries?.[0];
    return {
      edition_count: editionsData?.size ?? null,
      year: firstEdition?.publish_date || null,
      publisher: firstEdition?.publishers || [],
      language:
        firstEdition?.languages?.map((l) =>
          l.key?.replace("/languages/", ""),
        ) || [],
    };
  } catch {
    return { edition_count: null, year: null, publisher: [], language: [] };
  }
}

/**
 * Fetch an author's display name from their author key.
 *
 * @param {string} authorKey e.g. "/authors/OL34184A"
 * @returns {Promise<string>}
 */
export async function fetchAuthorName(authorKey) {
  try {
    const authorData = await fetch(
      `${OPEN_LIBRARY_BASE_URL}${authorKey}.json`,
    ).then((r) => (r.ok ? r.json() : null));
    return authorData?.name || "Unknown";
  } catch {
    return "Unknown";
  }
}

/**
 * Fetch a work's average rating and rating count.
 *
 * @param {string} workKeyPath e.g. "/works/OL27448W"
 * @returns {Promise<{avgRating: number|null, ratingCount: number}>}
 */
export async function fetchRatings(workKeyPath) {
  try {
    const r = await fetch(
      `${OPEN_LIBRARY_BASE_URL}${workKeyPath}/ratings.json`,
    ).then((res) => (res.ok ? res.json() : null));
    return {
      avgRating:
        typeof r?.summary?.average === "number" ? r.summary.average : null,
      ratingCount: typeof r?.summary?.count === "number" ? r.summary.count : 0,
    };
  } catch {
    return { avgRating: null, ratingCount: 0 };
  }
}

/**
 * Pull the synopsis text out of a work JSON object that's already been
 * fetched. Not a network call — just a data transform.
 *
 * @param {object|null} workData
 * @returns {string|null}
 */
export function extractSynopsis(workData) {
  if (!workData) return null;
  if (workData.description) {
    return typeof workData.description === "string"
      ? workData.description
      : workData.description.value;
  }
  if (workData.excerpts && workData.excerpts.length > 0) {
    return workData.excerpts[0].excerpt || workData.excerpts[0].comment || null;
  }
  return null;
}
