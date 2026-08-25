export default function TitleCard({
  title,
  year,
  author,
  avgRating,
  ratingCount,
}) {
  const filledStars = avgRating ? Math.round(avgRating) : 0;
  const maxStars = 5;

  return (
    <div>
      <h3 className="text-2xl font-serif mr-4 inline">{title}</h3>
      <span className="text-gray-500 ml-2">{year || ""}</span>
      <div className="italic text-gray-700 mt-1">{author}</div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center text-yellow-500">
          {Array.from({ length: maxStars }).map((_, i) => (
            <span key={i} className="text-xl">
              {i < filledStars ? "★" : "☆"}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {avgRating ? avgRating.toFixed(1) : "—"} ({ratingCount || 0})
        </div>
      </div>
    </div>
  );
}
