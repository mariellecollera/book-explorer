export default function DetailsCard({ book, category }) {
  return (
    <div className="flex flex-col items-center text-center justify-center gap-1 px-8 py-2 border">
      <span className="text-sm text-gray-600">{category}</span>
      <span className="text-sm">{book}</span>
    </div>
  );
}
