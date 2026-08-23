import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookGrid from "../components/BookGrid";
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

      <div className="w-full border border-black p-5">
        <div className="flex justify-end mb-5">
          <button className="button-black" onClick={() => navigate("/results")}>
            + Add a book
          </button>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center italic text-[18px] py-8 ">
            <img src={empty} alt="No books saved" className="w-30 h-30 mb-2" />
            Your Umbrella is empty.
          </div>
        ) : (
          <BookGrid books={books} isMyUmbrella={true} />
        )}
      </div>
    </main>
  );
}
