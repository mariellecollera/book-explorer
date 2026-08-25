import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PlaceholderCover from "../components/PlaceholderCover";
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

  const filledStars = book?.avgRating ? Math.round(book.avgRating) : 0;
  const maxStars = 5;

  return (
    <div className="mx-auto px-5 py-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="button-black mb-6">
        ← Back
      </button>

      {loading ? (
        <BookDetailsSkeleton />
      ) : (
        <div className="flex gap-8">
          <div className="flex-shrink-0">
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
            <div>
              <h3 className="text-2xl font-serif mr-4 inline">{book?.title}</h3>
              <span className="text-gray-500 ml-2">{book?.year || ""}</span>
              <div className="italic text-gray-700 mt-1">{book?.author}</div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: maxStars }).map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < filledStars ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {book?.avgRating ? book.avgRating.toFixed(1) : "—"} (
                  {book?.ratingCount || 0})
                </div>
              </div>
            </div>

            <div className="mt-6 text-base leading-relaxed text-gray-800">
              {book?.synopsis || "Synopsis not available."}
            </div>

            <div className="mt-6 border p-4 w-full">
              <div className="text-sm">
                Number of Editions:{" "}
                <span className="font-medium">
                  {book?.edition_count ?? "N/A"}
                </span>
              </div>
              <div className="text-sm">
                Publisher:{" "}
                <span className="font-medium">{book?.publisher || "N/A"}</span>
              </div>
              <div className="text-sm">
                Language:{" "}
                <span className="font-medium">{book?.language || "N/A"}</span>
              </div>
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

function BookDetailsSkeleton() {
  return (
    <div className="flex gap-8 animate-pulse">
      <div className="flex-shrink-0">
        <div className="flex flex-col items-center justify-center w-56">
          <div className="w-full h-[320px] bg-gray-200 border mb-2" />
          <div className="h-9 w-full bg-gray-200" />
        </div>
      </div>

      <div className="flex-1">
        <div className="h-7 w-2/3 bg-gray-200 mb-3" />
        <div className="h-4 w-1/3 bg-gray-200 mb-4" />
        <div className="h-5 w-40 bg-gray-200 mb-6" />

        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-200" />
          <div className="h-4 w-full bg-gray-200" />
          <div className="h-4 w-5/6 bg-gray-200" />
          <div className="h-4 w-3/4 bg-gray-200" />
        </div>

        <div className="border p-4 w-full space-y-2">
          <div className="h-4 w-1/2 bg-gray-200" />
          <div className="h-4 w-1/3 bg-gray-200" />
          <div className="h-4 w-1/4 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
