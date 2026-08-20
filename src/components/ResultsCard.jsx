import { useState } from "react";
import PlaceholderCover from "./PlaceholderCover";
import umbrella_shape from "../assets/umbrella_shape.svg";

export default function ResultsCard({
  cover,
  title,
  year,
  author,
  isMyUmbrella,
  onSelect,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="w-full max-w-[220px] cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect && onSelect();
      }}
    >
      <div className="w-[90px] h-[135px] sm:w-[110px] sm:h-[165px] md:w-[180px] md:h-[250px] border border-black shadow-[3px_4px_6px_0_rgba(0,0,0,0.25)] overflow-hidden mb-4 relative">
        {isMyUmbrella && (
          <img
            src={umbrella_shape}
            alt="umbrella shape"
            className="absolute top-[-5px] right-[-5px] rotate-45 w-12 object-cover"
          />
        )}
        {cover ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <img
                  src="/favicon.svg"
                  alt="loading"
                  className="w-16 h-16 text-gray-400 animate-pulse"
                  style={{ animationDuration: "1400ms" }}
                />
              </div>
            )}
            <img
              src={cover}
              alt={`${title} cover`}
              className={`w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        ) : (
          <PlaceholderCover title={title} author={author} year={year} />
        )}
      </div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{year}</div>
      <div className="italic text-sm">{author}</div>
    </div>
  );
}
