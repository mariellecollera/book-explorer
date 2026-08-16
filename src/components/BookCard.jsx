export default function BookCard({ cover, title, year, author, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect && onSelect();
      }}
      className="w-[167px] flex flex-col gap-2.5 cursor-pointer"
    >
      <div className="w-[167px] h-[234px] border border-black shadow-[3px_4px_6px_0_rgba(0,0,0,0.25)] overflow-hidden">
        <img
          src={cover}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[var(--color-white)] p-[7.5px]">
        <div className="flex items-baseline gap-[7.5px] whitespace-nowrap">
          <span className="text-[15px] text-black">{title}</span>
          <span className="text-xs text-[#8b8b8b]">{year}</span>
        </div>
        <div className="italic text-[13.5px] text-black mt-0.5">{author}</div>
      </div>
    </div>
  );
}
