/**
 * Extract synopsis text out of a work JSON object.
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
