import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "./LoadingState";
import PlaceholderCover from "../components/PlaceholderCover";
import TitleCard from "../components/TitleCard";
import DetailsCard from "../components/DetailsCard";
import Modal from "../components/Modal";
import {
  addToMyUmbrella,
  isInMyUmbrella,
  removeFromMyUmbrella,
} from "../utils/myUmbrella";
import { useBookDetails } from "../hooks/useBookDetails";

export default function BookDetails() {
  const { workKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateBook = location.state?.book;

  const { book, loading, notFound } = useBookDetails(workKey, stateBook);

  const [inUmbrella, setInUmbrella] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setInUmbrella(book ? isInMyUmbrella(book.id) : false);
  }, [book]);

  function toggleUmbrella() {
    if (!book) return;
    if (inUmbrella) {
      removeFromMyUmbrella(book.id);
      setInUmbrella(false);
      setModalMessage(`"${book.title}" is no longer in your Umbrella.`);
    } else {
      addToMyUmbrella(book);
      setInUmbrella(true);
      setModalMessage(`"${book.title}" is now in your Umbrella.`);
    }
    setModalOpen(true);
  }

  if (notFound) {
    return (
      <div className="mx-auto px-5 py-8 max-w-5xl">
        <button onClick={() => navigate(-1)} className="button-black mb-6">
          ← Back
        </button>
        <div className="text-center italic py-20">Book not found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 sm:px-5 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="button-dashed mb-6">
        ← Back
      </button>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
          <div className="self-start sm:hidden">
            <TitleCard
              title={book?.title}
              year={book?.year}
              author={book?.author}
              avgRating={book?.avgRating}
              ratingCount={book?.ratingCount}
            />
          </div>

          <div className=" flex-shrink-0">
            <div className="flex flex-col items-center justify-center w-56">
              <div className="w-full h-[320px] border mb-2">
                {book?.cover ? (
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderCover
                    cover={book?.cover}
                    title={book?.title}
                    year={book?.year}
                    author={book?.author}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={toggleUmbrella}
                className="button-black"
              >
                {inUmbrella
                  ? "Remove from My Umbrella"
                  : "+ Add to My Umbrella"}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="hidden sm:block">
              <TitleCard
                title={book?.title}
                year={book?.year}
                author={book?.author}
                avgRating={book?.avgRating}
                ratingCount={book?.ratingCount}
              />
            </div>

            <div className="mt-6 text-base leading-relaxed text-gray-800">
              {book?.synopsis || "Synopsis not available."}
            </div>

            <div className="flex justify-center sm:justify-start gap-2 mt-6">
              <DetailsCard
                value={book?.edition_count ?? "N/A"}
                category="No. of Editions"
              />
              <DetailsCard
                value={book?.publisher || "N/A"}
                category="Publisher"
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={inUmbrella ? "Successfully Added!" : "Successfully Removed."}
        message={modalMessage}
      />
    </div>
  );
}
