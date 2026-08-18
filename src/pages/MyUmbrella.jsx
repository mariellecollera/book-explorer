import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultsCard from "../components/ResultsCard";
import { getMyUmbrella } from "../utils/myUmbrella";
import empty from "../assets/no_books.svg";

export default function MyUmbrella() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBooks(getMyUmbrella());
  }, []);

  return (
    <div className="mx-auto px-5 py-8 max-w-6xl">
      <div className="flex flex-col items-center mb-10">
        {/* placeholder wordmark: drop the final asset at public/my-umbrella-wordmark.svg */}
        <img
          src="/my-umbrella-wordmark.svg"
          alt="My Umbrella"
          className="h-16 md:h-20 w-auto"
        />
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
              <ResultsCard
                key={b.id}
                {...b}
                onSelect={() =>
                  navigate(
                    `/book/${encodeURIComponent(b.id.replace("/works/", ""))}`,
                    { state: { book: b } },
                  )
                }
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button className="button-black mb-6">+ Add a book</button>
          </div>
        </>
      )}
    </div>
  );
}
