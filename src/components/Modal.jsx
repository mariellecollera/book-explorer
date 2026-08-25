import { Link } from "react-router-dom";

export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-white)] border border-black shadow-[3px_4px_6px_0_rgba(0,0,0,0.25)] p-6 w-full max-w-sm mx-5"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
        <p className="italic text-md mb-6">{message}</p>
        <div className="flex justify-between">
          <button type="button" className="button-white">
            <Link to="/my-umbrella" className="button-white">
              View My Umbrella
            </Link>
          </button>
          <button type="button" onClick={onClose} className="button-black">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
