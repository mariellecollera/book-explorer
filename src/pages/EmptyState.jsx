import empty from "../assets/no_books.svg";

export default function EmptyState() {
  return (
    <div className="py-8 flex flex-col items-center justify-center italic text-[18px]">
      <img src={empty} alt="No books found" className="w-30 h-30 mb-2" />
      No books found.
    </div>
  );
}
