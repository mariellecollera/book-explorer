import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultsCard from "../components/ResultsCard";
import { getMyUmbrella, removeFromMyUmbrella } from "../utils/myUmbrella";
import my_umbrella from "../assets/my_umbrella.svg";
import empty from "../assets/no_books.svg";

export default function MyUmbrella() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBooks(getMyUmbrella());
  }, []);

  function handleRemove(id) {
    setBooks(removeFromMyUmbrella(id));
  }

  return (
    <main className="flex flex-col items-center max-w-[1200px] m-10 px-5 py-10">
      <div className="flex flex-col items-center mb-10 gap-5">
        <img src={my_umbrella} alt="My Umbrella" className="h-14 w-auto" />
        <p className="text-black italic text-[20px] mb-5">
          View all books under your umbrella.
        </p>

        <button className="button-black mb-6">+ Add a book</button>
      </div>

      {books.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center italic text-[18px]">
          <img src={empty} alt="No books saved" className="w-30 h-30 mb-2" />
          Your Umbrella is empty.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-2 gap-y-4 items-start place-items-center">
            {books.map((b) => (
              <div key={b.id} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(b.id);
                  }}
                  aria-label={`Remove ${b.title} from My Umbrella`}
                  className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-black bg-white text-xs hover:bg-black hover:text-white"
                >
                  ×
                </button>
                <ResultsCard
                  {...b}
                  onSelect={() =>
                    navigate(
                      `/book/${encodeURIComponent(b.id.replace("/works/", ""))}`,
                      { state: { book: b } },
                    )
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
