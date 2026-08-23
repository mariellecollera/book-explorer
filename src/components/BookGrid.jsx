import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

export default function BookGrid({ books, isMyUmbrella }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4 justify-items-center">
      {books.map((b) => (
        <BookCard
          key={b.id}
          {...b}
          isMyUmbrella={isMyUmbrella}
          onSelect={() =>
            navigate(
              `/book/${encodeURIComponent(b.id.replace("/works/", ""))}`,
              {
                state: { book: b },
              },
            )
          }
        />
      ))}
    </div>
  );
}
