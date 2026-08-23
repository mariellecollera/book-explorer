import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
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
        <p className="text-black italic text-[16px]">
          View all books under your umbrella.
        </p>
      </div>

      <div className="w-full border border-black p-6">
        <div className="flex justify-end mb-5">
          <button className="button-black" onClick={() => navigate("/results")}>
            + Add a book
          </button>
        </div>

        {books.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center italic text-[18px]">
            <img src={empty} alt="No books saved" className="w-30 h-30 mb-2" />
            Your Umbrella is empty.
          </div>
        ) : (
          <div className="bg-[pink] grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 items-start place-items-center items-center">
            {books.map((b) => (
              <div key={b.id} className="relative">
                <BookCard
                  {...b}
                  isMyUmbrella={true}
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
        )}
      </div>
    </main>
  );
}
